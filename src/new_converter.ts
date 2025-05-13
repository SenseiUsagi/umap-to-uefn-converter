import {
    adBiome,
    farmBiome,
    grassBiome,
    jungleBiome,
    mountainBiome,
    snowBiome,
    swampBiome,
} from "./assets/data/portedBiomeData";
import {
    LODData,
    OverrideMaterials,
    RelativeLocation,
    RelativeRotation,
    RelativeScale,
    ResourceType,
    StaticMesh,
    Template,
    TextureData,
} from "./classes";
import {
    Biome,
    deepMerge,
    getAdditionalWorld,
    ObjectData,
    processJSON,
    RelaventObjectData,
    UEFNLabelStrings,
} from "./constants";
import GlobalStore, {
    GlobalState,
    useOverrideBiome,
} from "./state/globalstate";
export function isTerrain(objectPath: string) {
    if (
        // TODO: Rework this to use the data in modelsInfo.ts
        objectPath.includes("DS_Fortnite_Terrain_NoLOD") ||
        objectPath.includes("Environments/World/Sidewalks") ||
        objectPath.includes("S_Road") ||
        objectPath.includes("S_Asphalt") ||
        objectPath.includes("S_SmallStreet") ||
        objectPath.includes("S_Water") ||
        objectPath.includes("BP_Athena_Water") ||
        objectPath.includes("S_Basketball") ||
        objectPath.includes("S_Sidewalk") ||
        objectPath.includes("SM_SmallCrater_Test") ||
        objectPath.includes("BP_Waterfall_C") ||
        objectPath.includes("S_Athena_Foundation2Landscape_") ||
        objectPath.includes("SM_DesertRoad") ||
        objectPath.includes("SM_Athena_SandBunker")
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
        mesh.MeshData.ObjectPath.includes("Ground") ||
        mesh.MeshData.ObjectPath.includes("S_SoccerPitch")
    ) {
        type = "terrain";
    }

    if (mesh.MeshData.ObjectPath.includes("crater")) {
        type = "crater";
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
        type = "terrain-beach";
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
            !material.ObjectPath.includes("Cliff")) ||
        material.ObjectName === "Terrain_Mat'" ||
        material.ObjectPath.includes("SoccerPitch")
    ) {
        type = "terrain-normal";
    }

    if (material.ObjectPath.includes("BasketballCourt")) {
        type = "basketball";
    }

    if (material.ObjectPath.includes("Parking")) {
        type = "parking";
    }

    if (material.ObjectPath.includes("crater")) {
        type = "crater";
    }

    if (material.ObjectPath.includes("Forest")) {
        type = "terrain-forest";
    }

    if (
        material.ObjectPath.includes("Cliff") ||
        material.ObjectPath.includes("Cliff_White")
    ) {
        type = "cliff-white";
    }

    // Brown
    if (
        material.ObjectPath.includes("Cave_Grass") ||
        material.ObjectPath.includes("Cliff_Brown")
    ) {
        type = "cliff-brown";
    }

    // Cave (only brown)
    if (
        (material.ObjectPath.includes("Cave") &&
            !material.ObjectPath.includes("Grass")) ||
        (material.ObjectPath.includes("Dirt") &&
            !material.ObjectPath.includes("No"))
    ) {
        type = "cliff-brownCave";
    }

    // Water wall secondary
    if (material.ObjectPath.includes("UrbanWall")) {
        type = "waterWallSecondary";
    }

    if (material.ObjectPath.includes("Stream")) {
        let direction: string = "-forward";
        let waterType: string = "normal";
        type = "stream-";
        if (material.ObjectPath.includes("StreamToLake")) {
            waterType = "lakeTransition";
        }
        if (material.ObjectPath.includes("T-section")) {
            waterType = "tSection";
        }
        if (material.ObjectPath.includes("Reverse")) {
            direction = "-backwards";
        }
        if (material.ObjectPath.includes("Waterfall")) {
            direction = "";
            waterType = "cliff";
        }

        type += waterType + direction;
    }

    return type;
}

export function getBiomeToUse(
    staticMesh: StaticMesh,
    overrideMaterials: OverrideMaterials | undefined
) {
    const globalState: GlobalState = GlobalStore.getState();
    const finalTypes: string[] = [];
    if (typeof staticMesh !== "undefined") {
        const meshType = findTerrainTypeBasedMesh(staticMesh);
        if (
            meshType === "terrain" ||
            meshType === "cliff" ||
            meshType === "stream" ||
            meshType === "waterWall"
        ) {
            let materialType: string = "";
            let fixedType: string = "";
            if (typeof overrideMaterials !== "undefined") {
                for (
                    let index = 0;
                    index < overrideMaterials.Materials.length;
                    index++
                ) {
                    const element = overrideMaterials.Materials[index];
                    materialType = findTerrainTypeBasedMaterial(element);
                    fixedType = materialType;
                    if (!materialType) {
                        if (meshType === "terrain") {
                            fixedType = meshType + "-normal";
                        } else if (meshType === "cliff") {
                            fixedType = meshType + "-brown";
                            // if (globalState.currentSettings.overrideBiome.forceCave) {
                            // 	fixedType += "Cave";
                            // }
                        }
                    }
                }
            } else if (meshType === "terrain") {
                // if (globalState.currentSettings.overrideBiome.forceCave) {
                // 	fixedType = "cliff-brownCave";
                // } else {
                // }
                fixedType = meshType + "-normal";
            } else if (meshType === "cliff") {
                fixedType = meshType + "-brown";
                // if (globalState.currentSettings.overrideBiome.forceCave) {
                // 	fixedType += "Cave";
                // }
            }
            finalTypes.push(fixedType);
        } else {
            finalTypes.push(meshType);
        }
    }

    let biome: Biome = grassBiome;
    const biomeKey = (
        Object.keys(globalState.currentSettings.overrideBiome) as Array<
            keyof typeof globalState.currentSettings.overrideBiome
        >
    ).find((key) => {
        if (key !== "forceCave") {
            return globalState.currentSettings.overrideBiome[key] === true;
        }
    });

    if (typeof biomeKey !== "undefined") {
        if (biomeKey.includes("farm")) {
            biome = farmBiome;
        } else if (biomeKey.includes("mountain")) {
            biome = mountainBiome;
        } else if (biomeKey.includes("swamp")) {
            biome = swampBiome;
        } else if (biomeKey.includes("snow")) {
            biome = snowBiome;
        } else if (biomeKey.includes("ad")) {
            biome = adBiome;
        } else if (biomeKey.includes("jungle")) {
            biome = jungleBiome;
        }
        if (globalState.currentSettings.overrideBiome.forceCave) {
            const updatedTypes: string[] = [];
            finalTypes.forEach((element) => {
                if (element.includes("white") || element.includes("brown")) {
                    updatedTypes.push(element + "Cave");
                } else if (
                    element.includes("terrain") &&
                    globalState.currentSettings.overrideBiome.forceCave
                ) {
                    updatedTypes.push("cliff-brownCave");
                } else {
                    updatedTypes.push(element);
                }
            });
            finalTypes.length = 0;
            finalTypes.push(...updatedTypes);
        }
    }

    // Default will be grass
    const portedMaterialObjects: any = [];
    finalTypes.forEach((element) => {
        const keys = element.split("-");
        let currentData: any = { ...biome };

        keys.forEach((key) => {
            if (key) {
                currentData = currentData[key as keyof typeof currentData];
            }
        });
        if (currentData) {
            if (currentData.ObjectPath && currentData.ObjectName) {
                const copyBiomeData = { ...currentData };
                copyBiomeData.ObjectPath = `/${
                    globalState.currentSettings.portedModelsProjectName +
                    currentData.ObjectPath
                }`;
                portedMaterialObjects.push(copyBiomeData);
            }
        } else {
            portedMaterialObjects.push(null);
        }
    });

    return new OverrideMaterials(portedMaterialObjects);
}

export async function convertToUEFN_NEW(
    parsedJSON: any[],
    folderName: string,
    isLevel: boolean,
    locationOffset: RelativeLocation | null,
    rotationOffset: RelativeRotation | null
): Promise<string> {
    let convertedMap: string = isLevel
        ? UEFNLabelStrings.beginMap + UEFNLabelStrings.beginLevel
        : "";

    const alreadyProcessed: string[] = [];

    for (const element of parsedJSON) {
        const globalState: GlobalState = GlobalStore.getState();
        const objName: string = element.Name;
        const objType: string = element.Type;
        const objClass: string = element.Class;

        if (objName === "PersistentLevel") {
            continue;
        }
        if (objName === "StaticMeshComponent0") {
            continue;
        }
        if (objType === "LODActor") {
            continue;
        }
        if (objType === "BlockingVolume") {
            continue;
        }
        if (objType === "BodySetup") {
            continue;
        }
        if (objType === "BookMark") {
            continue;
        }
        if (objType === "BoxComponent") {
            continue;
        }
        if (objType === "BrushComponent") {
            continue;
        }
        if (objType === "FoliageInstancedStaticMeshComponent") {
            continue;
        }
        if (objType === "InstancedFoliageActor") {
            continue;
        }
        if (objType === "ForceFeedbackComponent") {
            continue;
        }
        if (objType === "LevelBounds") {
            continue;
        }
        if (objType === "Model") {
            continue;
        }
        if (objType === "TimelineComponent") {
            continue;
        }
        if (objType === "SceneComponent") {
            continue;
        }
        if (objType === "FortWorldSettings") {
            continue;
        }
        if (objType === "ObjectProperty") {
            continue;
        }

        if (alreadyProcessed.findIndex((name) => name === objName) !== -1) {
            continue;
        }

        let actualLocation: any;
        let actualRotation: any;
        let actualScale: any;

        const elementProperties: any[] = [element];
        parsedJSON.forEach((dataObj) => {
            if (dataObj.Outer) {
                if (dataObj.Outer === objName) {
                    elementProperties.push(dataObj);
                    if (
                        dataObj.Type === "StaticMeshComponent" ||
                        dataObj.Type === "SceneComponent"
                    ) {
                        if (dataObj.Properties) {
                            if (
                                dataObj.Properties.RelativeLocation !==
                                undefined
                            ) {
                                actualLocation =
                                    dataObj.Properties.RelativeLocation;
                            }
                            if (
                                dataObj.Properties.RelativeRotation !==
                                undefined
                            ) {
                                actualRotation =
                                    dataObj.Properties.RelativeRotation;
                            }
                            if (
                                dataObj.Properties.RelativeScale3D !== undefined
                            ) {
                                actualScale =
                                    dataObj.Properties.RelativeScale3D;
                            }
                        }
                    }
                }
            }
        });

        const combinedProperties = deepMerge(...elementProperties);

        const textureData: ObjectData[] = [];
        if (combinedProperties.Properties !== undefined) {
            Object.keys(combinedProperties.Properties).forEach((key) => {
                if (key.includes("TextureData-")) {
                    textureData.push(combinedProperties.Properties[key]);
                } else if (key.includes("TextureData")) {
                    console.warn(
                        "Warning! JSON covertion for TextureData wasnt successful! TextureData will not be used!"
                    );
                }
            });
        }

        const actualRelevantData: RelaventObjectData = {
            name: objName,
            class: objClass,
            type: objType,
            location:
                actualLocation !== undefined
                    ? new RelativeLocation(
                          actualLocation.X,
                          actualLocation.Y,
                          actualLocation.Z
                      )
                    : new RelativeLocation(0, 0, 0),
            rotation:
                actualRotation !== undefined
                    ? new RelativeRotation(
                          actualRotation.Pitch,
                          actualRotation.Yaw,
                          actualRotation.Roll
                      )
                    : new RelativeRotation(0, 0, 0),
            scale:
                actualScale !== undefined
                    ? new RelativeScale(
                          actualScale.X,
                          actualScale.Y,
                          actualScale.Z
                      )
                    : new RelativeScale(1, 1, 1),
            lodData: undefined,
            materials:
                combinedProperties.Properties !== undefined
                    ? combinedProperties.Properties.OverrideMaterials !==
                      undefined
                        ? new OverrideMaterials(
                              combinedProperties.Properties.OverrideMaterials
                          )
                        : undefined
                    : undefined,
            mesh: undefined,
            template: undefined,
            resourceType:
                combinedProperties.Properties !== undefined
                    ? combinedProperties.Properties.ResourceType !== undefined
                        ? new ResourceType(
                              combinedProperties.Properties.ResourceType
                          )
                        : undefined
                    : undefined,
            textureData:
                textureData.length > 0
                    ? new TextureData(textureData)
                    : undefined,
            mirrored: combinedProperties.Properties?.bMirrored ?? false,
        };
        if (objClass.includes("BlueprintGeneratedClass")) {
            actualRelevantData.template =
                combinedProperties.Template !== undefined
                    ? new Template(combinedProperties.Template)
                    : actualRelevantData.template;
        }
        if (objClass.includes("FortStaticMeshActor")) {
            actualRelevantData.mesh =
                combinedProperties.Properties !== undefined
                    ? combinedProperties.Properties.StaticMesh !== undefined
                        ? new StaticMesh(
                              combinedProperties.Properties.StaticMesh
                          )
                        : actualRelevantData.mesh
                    : actualRelevantData.mesh;
        }
        if (combinedProperties.LODData !== undefined) {
            if (actualRelevantData.lodData === undefined) {
                actualRelevantData.lodData = new LODData(
                    combinedProperties.LODData
                );
            }
        }
        if (
            objClass.includes("AudioComponent") &&
            actualLocation === undefined
        ) {
            continue;
        }
        if (
            objClass.includes("ParticleSystemComponent") &&
            actualLocation === undefined
        ) {
            continue;
        }
        if (
            objClass.includes("PointLightComponent") &&
            actualLocation === undefined
        ) {
            continue;
        }
        if (
            objClass.includes("PostProcessComponent") &&
            actualLocation === undefined
        ) {
            continue;
        }
        if (
            objClass.includes("SpotLightComponent") &&
            actualLocation === undefined
        ) {
            continue;
        }

        if (globalState.currentSettings.propagateLevels) {
            if (
                combinedProperties.Properties?.AdditionalWorlds !== undefined ||
                combinedProperties.Properties?.WorldAsset !== undefined
            ) {
                let filePathWorld: string;
                if (
                    combinedProperties.Properties?.AdditionalWorlds !==
                    undefined
                ) {
                    filePathWorld =
                        combinedProperties.Properties.AdditionalWorlds[0].AssetPathName.split(
                            "."
                        )[0];
                } else {
                    filePathWorld =
                        combinedProperties.Properties.WorldAsset.AssetPathName.split(
                            "."
                        )[0];
                }
                const cachedFile = globalState.cachedJsonFiles.find(
                    (cachedJSON) => cachedJSON.filePath === filePathWorld
                );
                if (cachedFile === undefined) {
                    const jsonFile: File | undefined | null =
                        await getAdditionalWorld(filePathWorld);
                    if (jsonFile) {
                        globalState.addJSONtoCache(jsonFile, filePathWorld);
                        const json = await jsonFile!.text();
                        const nestedFolderName =
                            globalState.currentSettings.customFolderName.trim()
                                .length > 0
                                ? globalState.currentSettings.customFolderName
                                : jsonFile.name.split(".")[0];
                        try {
                            const insideLevel = await convertToUEFN_NEW(
                                processJSON(json),
                                globalState.currentSettings.customFolderName.trim()
                                    .length > 0
                                    ? folderName
                                    : folderName + "/" + nestedFolderName,
                                false,
                                locationOffset !== null
                                    ? actualRelevantData.location.displace(
                                          locationOffset,
                                          rotationOffset
                                      )
                                    : actualRelevantData.location,
                                actualRelevantData.rotation !== undefined
                                    ? rotationOffset !== null
                                        ? actualRelevantData.rotation.add(
                                              rotationOffset
                                          )
                                        : actualRelevantData.rotation
                                    : null
                            );
                            convertedMap += insideLevel;
                        } catch (error) {
                            throw error;
                        }
                    } else {
                        continue;
                    }
                } else {
                    const json = await cachedFile.file!.text();
                    const nestedFolderName =
                        globalState.currentSettings.customFolderName.trim()
                            .length > 0
                            ? globalState.currentSettings.customFolderName
                            : cachedFile.file.name.split(".")[0];
                    try {
                        const insideLevel = await convertToUEFN_NEW(
                            processJSON(json),
                            globalState.currentSettings.customFolderName.trim()
                                .length > 0
                                ? folderName
                                : folderName + "/" + nestedFolderName,
                            false,
                            locationOffset !== null
                                ? actualRelevantData.location.displace(
                                      locationOffset,
                                      rotationOffset
                                  )
                                : actualRelevantData.location,
                            actualRelevantData.rotation !== undefined
                                ? rotationOffset !== null
                                    ? actualRelevantData.rotation.add(
                                          rotationOffset
                                      )
                                    : actualRelevantData.rotation
                                : null
                        );
                        convertedMap += insideLevel;
                    } catch (error) {
                        throw error;
                    }
                }
            }
        }

        if (globalState.currentSettings.exportNoTerrain) {
            if (actualRelevantData.mesh !== undefined) {
                if (isTerrain(actualRelevantData.mesh.MeshData.ObjectPath)) {
                    continue;
                }
            } else if (actualRelevantData.template !== undefined) {
                if (isTerrain(actualRelevantData.template.ObjData.ObjectPath)) {
                    continue;
                }
            }
        }

        if (globalState.currentSettings.exportOnlyTerrain) {
            if (actualRelevantData.mesh !== undefined) {
                if (!isTerrain(actualRelevantData.mesh.MeshData.ObjectPath)) {
                    continue;
                }
            } else if (actualRelevantData.template !== undefined) {
                if (
                    !isTerrain(actualRelevantData.template.ObjData.ObjectPath)
                ) {
                    continue;
                }
            }
        }
        const generatedActor = processPropertiesObj(
            actualRelevantData,
            folderName,
            locationOffset,
            rotationOffset
        );

        convertedMap += generatedActor;
    }

    convertedMap += isLevel
        ? UEFNLabelStrings.endLevel +
          UEFNLabelStrings.surface +
          UEFNLabelStrings.endMap
        : "";

    return convertedMap;
}

function processPropertiesObj(
    objData: RelaventObjectData,
    folderName: string,
    locationOffset: RelativeLocation | null,
    rotationOffset: RelativeRotation | null
) {
    const globalState: GlobalState = GlobalStore.getState();
    let completeActor: string = "";
    if (objData.mesh !== undefined) {
        if (
            globalState.currentSettings.usePortedModels &&
            globalState.currentSettings.portedModelsProjectName === "Game"
        ) {
            completeActor += UEFNLabelStrings.beginActor(
                "/Script/Engine.StaticMeshActor"
            );
        } else {
            completeActor += UEFNLabelStrings.beginActor(
                "/Script/FortniteGame.FortStaticMeshActor"
            );
        }
        completeActor += UEFNLabelStrings.beginObject(undefined);
        completeActor += objData.mesh.convertToUEFN();
        if (
            globalState.currentSettings.usePortedModels &&
            useOverrideBiome(globalState)
        ) {
            completeActor += getBiomeToUse(
                objData.mesh,
                objData.materials
            ).convertToUEFN();
        } else {
            completeActor += objData.materials?.convertToUEFN() ?? "";
        }
    } else if (objData.template !== undefined) {
        if (
            globalState.currentSettings.usePortedModels &&
            globalState.currentSettings.portedModelsProjectName === "Game"
        ) {
            // Special Case for BPs I have models of
            return "";
        } else {
            completeActor += objData.template.convertToUEFN();
            if (objData.type === "B_Athena_VendingMachine_C") {
                completeActor +=
                    UEFNLabelStrings.beginObject("DefaultSceneRoot");
            } else if (objData.type === "BP_Athena_Water_C") {
                completeActor += UEFNLabelStrings.beginObject("Water_Base");
            } else if (objData.type === "BP_Waterfall_C") {
                completeActor += UEFNLabelStrings.beginObject("StaticMesh1");
            } else {
                completeActor += UEFNLabelStrings.beginObject(undefined);
            }
            completeActor += objData.materials?.convertToUEFN() ?? "";
        }
    } else {
        // No BP or Model to spawn
        return "";
    }
    completeActor +=
        locationOffset !== null
            ? objData.location
                  .displace(locationOffset, rotationOffset)
                  .convertToUEFN()
            : objData.location.convertToUEFN();

    completeActor +=
        objData.rotation !== undefined
            ? rotationOffset !== null
                ? objData.rotation.add(rotationOffset).convertToUEFN()
                : objData.rotation.convertToUEFN()
            : "";

    completeActor +=
        objData.scale !== undefined ? objData.scale?.convertToUEFN() : "";
    completeActor +=
        objData.lodData !== undefined ? objData.lodData.convertToUEFN() : "";
    completeActor += UEFNLabelStrings.endObject;
    completeActor +=
        objData.textureData !== undefined
            ? objData.textureData.convertToUEFN()
            : "";
    completeActor += objData.mirrored ? UEFNLabelStrings.mirrored : "";
    completeActor +=
        objData.resourceType !== undefined
            ? objData.resourceType.convertToUEFN()
            : "";
    completeActor += UEFNLabelStrings.customMaterial;
    completeActor += UEFNLabelStrings.endObject;
    completeActor += UEFNLabelStrings.actorLabel(objData.name);
    completeActor += UEFNLabelStrings.folderPath(folderName);
    completeActor += UEFNLabelStrings.endActor;

    return completeActor;
}
