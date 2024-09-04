import { act } from "react";
import {
    LODData,
    OverrideMaterials,
    RelativeLocation,
    RelativeRotation,
    RelativeScale,
    ResourceType,
    Sound,
    StaticMesh,
    Template,
    TextureData,
    UEFNObject,
} from "./classes";
import { ObjectData, UEFNLabelStrings, convertedLevel } from "./constants";
import GlobalStore, { GlobalState } from "./state/globalstate";
import { grassBiome } from "./assets/data/modelsInfo";

export function isTerrain(objectPath: string) {
    if (
        objectPath.includes("DS_Fortnite_Terrain_NoLOD") ||
        objectPath.includes("Environments/World/Sidewalks") ||
        objectPath.includes("S_Road") ||
        objectPath.includes("S_Asphalt") ||
        objectPath.includes("S_SmallStreet") ||
        objectPath.includes("S_Water") ||
        objectPath.includes("BP_Athena_Water") ||
        objectPath.includes("S_Basketball") ||
        objectPath.includes("S_Sidewalk")
    ) {
        return true;
    }
    return false;
}

export function findTerrainTypeBasedMesh(mesh: StaticMesh) {
    let type = "";

    // Ground
    if (
        mesh.MeshData.ObjectPath.includes("Elevation_Ground") ||
        (mesh.MeshData.ObjectPath.includes("GeoSlope_2W") &&
            !mesh.MeshData.ObjectPath.includes("Straight")) ||
        (mesh.MeshData.ObjectPath.includes("GeoSlope_2W") &&
            mesh.MeshData.ObjectPath.includes("1L_a")) ||
        mesh.MeshData.ObjectPath.includes("Ground")
    ) {
        type = "terrain";
    }

    // Farm Field
    if (mesh.MeshData.ObjectPath.includes("Garden")) {
        type = "farmField";
    }

    // Beach Terrain
    if (
        mesh.MeshData.ObjectPath.includes("Shoreline_1W_Beach") ||
        mesh.MeshData.ObjectPath.includes("Shoreline_1W_ToBeach")
    ) {
        type = "terrainBeach";
    }

    // Sidewalks
    if (
        mesh.MeshData.ObjectPath.includes("Sidewalk") ||
        mesh.MeshData.ObjectPath.includes("SmallStreets") ||
        mesh.MeshData.ObjectPath.includes("BridgeStreet")
    ) {
        type = "sideWalks";
    }

    // Cliffs
    if (
        (mesh.MeshData.ObjectPath.includes("Cave") &&
            !mesh.MeshData.ObjectPath.includes("Urban") &&
            !mesh.MeshData.ObjectPath.includes("Ground")) ||
        mesh.MeshData.ObjectPath.includes("Cliff") ||
        mesh.MeshData.ObjectPath.includes("Elevation_2W") ||
        mesh.MeshData.ObjectPath.includes("Elevation_Step") ||
        (mesh.MeshData.ObjectPath.includes("Shoreline_1W") &&
            !mesh.MeshData.ObjectPath.includes("Beach")) ||
        (mesh.MeshData.ObjectPath.includes("GeoSlope_2W_Straight") &&
            !mesh.MeshData.ObjectPath.includes("1L"))
    ) {
        type = "cliff";
    }

    if (mesh.MeshData.ObjectPath.includes("Stream_2W")) {
        type = "stream";
    }

    if (
        mesh.MeshData.ObjectPath.includes("WaterWall") ||
        (mesh.MeshData.ObjectPath.includes("Cave") &&
            mesh.MeshData.ObjectPath.includes("Urban"))
    ) {
        type = "waterWall";
    }

    return type;
}

export function findTerrainTypeBasedMaterial(material: ObjectData | null) {
    // Add data for rural terrain, stream and waterwall
    if (material === null) {
        return "";
    }
    let type: string = "";

    if (
        (material.ObjectPath.includes("Athena_Terrain_Mat_Biome") &&
            !material.ObjectPath.includes("Cliff")) ||
        (material.ObjectPath.includes("Athena_Terrain_Mat") &&
            !material.ObjectPath.includes("Cliff"))
    ) {
        type = "terrain";
    }

    if (material.ObjectPath.includes("Forest")) {
        type = "terrainForest";
    }

    if (
        material.ObjectPath.includes("Cliff") ||
        material.ObjectPath.includes("Cliff_White")
    ) {
        type = "cliffWhite";
    }

    // Brown
    if (
        material.ObjectPath.includes("Cave_Grass") ||
        material.ObjectPath.includes("Cliff_Brown")
    ) {
        type = "cliffBrown";
    }

    // Cave (only brown)
    if (
        (material.ObjectPath.includes("Cave") &&
            !material.ObjectPath.includes("Grass")) ||
        (material.ObjectPath.includes("Dirt") &&
            !material.ObjectPath.includes("No"))
    ) {
        type = "cliffBrownCave";
    }

    return type;
}

export function getBiomeToUse(
    staticMesh: StaticMesh,
    overrideMaterials: OverrideMaterials
) {
    const globalState: GlobalState = GlobalStore.getState();
    const finalTypes: string[] = [];
    if (
        typeof staticMesh !== "undefined" &&
        typeof overrideMaterials !== "undefined"
    ) {
        const meshType = findTerrainTypeBasedMesh(staticMesh);
        if (
            meshType === "terrain" ||
            meshType === "cliff" ||
            meshType === "stream" ||
            meshType === "waterWall"
        ) {
            for (
                let index = 0;
                index < overrideMaterials.Materials.length;
                index++
            ) {
                const element = overrideMaterials.Materials[index];
                finalTypes.push(findTerrainTypeBasedMaterial(element));
            }
        } else {
            finalTypes.push(meshType);
        }
        console.log(
            "Final Type to be used:",
            finalTypes,
            "on this Mesh:",
            staticMesh,
            "Original Materials:",
            overrideMaterials
        );
    }

    // Multiple problems here: determining what biome to use; accessing that biomes data
    let biome = grassBiome;

    biome = Object.keys(globalState.currentSettings.overrideBiome).find(
        (key) => key
    );

    // Default will be grass
    if (typeof biome === "undefined") {
        const portedMaterialObjects: ObjectData[] = [];
        finalTypes.forEach((element) => {
            const keys = element.split("-");
            let currentData: any = null;
            keys.forEach((key) => {
                if (currentData === null) {
                    currentData = grassBiome[key];
                } else {
                    currentData = currentData[key];
                }
            });
        });
    }
}

function processDataObj(
    objName: string,
    folderName: string,
    dataObjs: any,
    lengthGreater2: boolean
) {
    const globalState: GlobalState = GlobalStore.getState();
    let actor: string = "";

    let startedActor: boolean = false;
    const objects: UEFNObject[] = [];

    let template: Template | undefined;
    const actorLabel = objName;
    const folder = folderName;
    let staticMesh: StaticMesh | undefined;
    let overrideMaterials: OverrideMaterials | undefined;
    let location: RelativeLocation | undefined;
    let rotation: RelativeRotation | undefined;
    let scale: RelativeScale | undefined;
    let textureData: TextureData | undefined;
    let lodData: LODData | undefined;
    let resourceType: ResourceType | undefined;
    let mirrored: boolean = false;
    let sound: Sound | undefined;

    for (let index = 0; index < dataObjs.length; index++) {
        const element = dataObjs[index];

        if (globalState.currentSettings.exportNoTerrain) {
            if (element.Template) {
                if (isTerrain(element.Template.ObjectPath)) {
                    break;
                }
            }
        }

        if (typeof element.Properties === "undefined") {
            return "";
        }
        if (typeof template === "undefined") {
            if (
                typeof element.Template !== "undefined" &&
                typeof element.Template === "object"
            ) {
                template = new Template(element.Template);
            }
        }

        if (typeof staticMesh === "undefined") {
            if (typeof element.Properties.StaticMesh !== "undefined") {
                staticMesh = new StaticMesh(element.Properties.StaticMesh);
            }
        }

        if (typeof sound === "undefined") {
            if (typeof element.Properties.Sound !== "undefined") {
                sound = new Sound(element.Properties.Sound);
            }
        }

        if (typeof element.Properties.OverrideMaterials !== "undefined") {
            overrideMaterials = new OverrideMaterials(
                element.Properties.OverrideMaterials
            );
        }

        if (typeof location === "undefined") {
            if (typeof element.Properties.RelativeLocation !== "undefined") {
                location = new RelativeLocation(
                    element.Properties.RelativeLocation.X,
                    element.Properties.RelativeLocation.Y,
                    element.Properties.RelativeLocation.Z
                );
            }
        }

        if (typeof rotation === "undefined") {
            if (typeof element.Properties.RelativeRotation !== "undefined") {
                rotation = new RelativeRotation(
                    element.Properties.RelativeRotation.Pitch,
                    element.Properties.RelativeRotation.Yaw,
                    element.Properties.RelativeRotation.Roll
                );
            }
        }

        if (typeof scale === "undefined") {
            if (typeof element.Properties.RelativeScale3D !== "undefined") {
                scale = new RelativeScale(
                    element.Properties.RelativeScale3D.X,
                    element.Properties.RelativeScale3D.Y,
                    element.Properties.RelativeScale3D.Z
                );
            }
        }

        if (typeof textureData === "undefined") {
            const data: ObjectData[] = [];
            Object.keys(element.Properties).forEach((key) => {
                if (key.includes("TextureData-")) {
                    data.push(element.Properties[key]);
                } else if (key.includes("TextureData")) {
                    console.warn(
                        "Warning! JSON covertion for TextureData wasnt successful! TextureData will not be used!"
                    );
                }
                if (data.length > 0) {
                    textureData = new TextureData(data);
                }
            });
        }

        if (typeof lodData === "undefined") {
            if (typeof element.LODData !== "undefined") {
                lodData = new LODData(element.LODData);
            }
        }

        if (typeof resourceType === "undefined") {
            if (typeof element.Properties.ResourceType !== "undefined") {
                resourceType = new ResourceType(
                    element.Properties.ResourceType
                );
            }
        }

        if (typeof element.Properties.bMirrored !== "undefined") {
            mirrored = true;
        }

        if (!lengthGreater2) {
            continue;
        } else {
            if (template !== undefined) {
                if (!startedActor) {
                    if (globalState.currentSettings.exportOnlyTerrain) {
                        if (!isTerrain(template.ObjData.ObjectPath)) {
                            break;
                        }
                    }
                    actor += template.convertToUEFN(
                        typeof staticMesh !== "undefined"
                    );
                    startedActor = true;
                }
            } else if (staticMesh !== undefined) {
                if (!startedActor) {
                    new Template(staticMesh.MeshData).convertToUEFN(true);
                    startedActor = true;
                }
            } else {
                continue;
            }
            if (
                staticMesh === undefined &&
                overrideMaterials === undefined &&
                location === undefined &&
                scale === undefined &&
                rotation === undefined &&
                textureData === undefined &&
                lodData === undefined &&
                resourceType === undefined &&
                sound === undefined
            ) {
                continue;
            }
            // TODO: Materials could be empty when its their default material
            // We would still need to know what type it is so:
            // First search type with material, if thats empty search type with mesh
            // then somehow connect the two so that the correct one can be determined
            // Where this could be the case: Water walls, sidewalks, farm fields
            const finalTypes: string[] = [];
            if (
                typeof staticMesh !== "undefined" &&
                typeof overrideMaterials !== "undefined"
            ) {
                const meshType = findTerrainTypeBasedMesh(staticMesh);
                if (
                    meshType === "terrain" ||
                    meshType === "cliff" ||
                    meshType === "stream" ||
                    meshType === "waterWall"
                ) {
                    for (
                        let index = 0;
                        index < overrideMaterials.Materials.length;
                        index++
                    ) {
                        const element = overrideMaterials.Materials[index];
                        finalTypes.push(findTerrainTypeBasedMaterial(element));
                    }
                } else {
                    finalTypes.push(meshType);
                }
                console.log(
                    "Final Type to be used:",
                    finalTypes,
                    "on this Mesh:",
                    staticMesh,
                    "Original Materials:",
                    overrideMaterials
                );
            }
            objects.push(
                new UEFNObject(
                    {
                        actorLabel: actorLabel,
                        folderPath: folder,
                        staticMesh:
                            typeof staticMesh !== "undefined"
                                ? staticMesh
                                : null,
                        overrideMaterials:
                            typeof overrideMaterials !== "undefined"
                                ? overrideMaterials
                                : null,
                        relativeLocation:
                            typeof location !== "undefined" ? location : null,
                        relativeRotation:
                            typeof rotation !== "undefined" ? rotation : null,
                        relativeScale:
                            typeof scale !== "undefined" ? scale : null,
                        textureData:
                            typeof textureData !== "undefined"
                                ? textureData
                                : null,
                        mirrored: mirrored,
                        lodData:
                            typeof lodData !== "undefined" ? lodData : null,
                        resourceType:
                            typeof resourceType !== "undefined"
                                ? resourceType
                                : null,
                        sound: typeof sound !== "undefined" ? sound : null,
                    },
                    index + 1 !== dataObjs.length,
                    element.Name
                )
            );
        }
    }

    if (lengthGreater2) {
        objects.sort((a, b) => {
            // Convert the objects to strings and check if they contain the target string
            const aContains = JSON.stringify(a).includes(
                "StaticMeshComponent0"
            );
            const bContains = JSON.stringify(b).includes(
                "StaticMeshComponent0"
            );

            // Sort based on whether the target string is contained
            if (aContains && !bContains) {
                return -1; // a should come before b
            } else if (!aContains && bContains) {
                return 1; // b should come before a
            } else {
                return 0; // no change in order
            }
        });

        if (objects.length === 0) {
            return "";
        }

        objects.forEach((obj) => {
            actor += obj.convertToUEFN();
        });

        actor += UEFNLabelStrings.endActor;
    } else {
        if (location !== undefined) {
            if (template !== undefined) {
                if (globalState.currentSettings.exportOnlyTerrain) {
                    if (!isTerrain(template.ObjData.ObjectPath)) {
                        return "";
                    }
                }
                actor += template.convertToUEFN(
                    typeof staticMesh !== "undefined"
                );
            } else if (staticMesh !== undefined) {
                actor += new Template(staticMesh.MeshData).convertToUEFN(true);
            } else {
                return "";
            }
            const finalTypes: string[] = [];
            if (
                typeof staticMesh !== "undefined" &&
                typeof overrideMaterials !== "undefined"
            ) {
                const meshType = findTerrainTypeBasedMesh(staticMesh);
                if (
                    meshType === "terrain" ||
                    meshType === "cliff" ||
                    meshType === "stream" ||
                    meshType === "waterWall"
                ) {
                    for (
                        let index = 0;
                        index < overrideMaterials.Materials.length;
                        index++
                    ) {
                        const element = overrideMaterials.Materials[index];
                        finalTypes.push(findTerrainTypeBasedMaterial(element));
                    }
                } else {
                    finalTypes.push(meshType);
                }
                console.log(
                    "Final Type to be used:",
                    finalTypes,
                    "on this Mesh:",
                    staticMesh,
                    "Original Materials:",
                    overrideMaterials
                );
            }
            actor += new UEFNObject(
                {
                    actorLabel: actorLabel,
                    folderPath: folder,
                    staticMesh:
                        typeof staticMesh !== "undefined" ? staticMesh : null,
                    overrideMaterials:
                        typeof overrideMaterials !== "undefined"
                            ? overrideMaterials
                            : null,
                    relativeLocation: location,
                    relativeRotation:
                        typeof rotation !== "undefined" ? rotation : null,
                    relativeScale: typeof scale !== "undefined" ? scale : null,
                    textureData:
                        typeof textureData !== "undefined" ? textureData : null,
                    mirrored: mirrored,
                    lodData: typeof lodData !== "undefined" ? lodData : null,
                    resourceType:
                        typeof resourceType !== "undefined"
                            ? resourceType
                            : null,
                    sound: typeof sound !== "undefined" ? sound : null,
                },
                false
            ).convertToUEFN();

            actor += UEFNLabelStrings.endActor;
        } else {
            return "";
        }
    }
    return actor;
}

export function convertToUEFN(
    parsedJSON: any[],
    folderName: string
): convertedLevel {
    let convertedMap: string =
        UEFNLabelStrings.beginMap + UEFNLabelStrings.beginLevel;

    const alreadyProcessed: string[] = [];

    parsedJSON.forEach((element) => {
        const globalState: GlobalState = GlobalStore.getState();
        // let convertedActor: string = "";

        const objName: string = element.Name;

        if (objName === "PersistentLevel") {
            return;
        }

        if (element.Type === "World" || element.Type === "Level") {
            return;
        }

        if (alreadyProcessed.findIndex((name) => name === objName) !== -1) {
            return;
        }

        const moreDataObjs: any[] = [element];

        parsedJSON.forEach((dataObj) => {
            if (dataObj.Outer) {
                if (dataObj.Outer === objName) {
                    moreDataObjs.push(dataObj);
                }
            }
        });

        if (moreDataObjs.length === 1) {
            return;
        } else {
            const generatedActor = processDataObj(
                objName,
                folderName,
                moreDataObjs,
                moreDataObjs.length > 2
            );
            if (generatedActor.trim().length === 0) {
                return;
            } else {
                convertedMap += generatedActor;
                alreadyProcessed.push(objName);
            }
        }
    });

    convertedMap += UEFNLabelStrings.endLevel;
    convertedMap += UEFNLabelStrings.surface;
    convertedMap += UEFNLabelStrings.endMap;

    return {
        fileName: folderName,
        fileContent: convertedMap,
        dateCreated: new Date(),
    };
}

export function writeFile(fileContent: string, fileName: string) {
    const blob = new Blob([fileContent], {
        type: "text/plain",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.txt`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
