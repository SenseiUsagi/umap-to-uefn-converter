import {
    LODData,
    OverrideMaterials,
    RelativeLocation,
    RelativeRotation,
    RelativeScale,
    StaticMesh,
    Template,
    TextureData,
} from "./classes";
import { UEFNLabelStrings, convertedLevel, tabIndent } from "./constants";

export function convertToUEFN(
    parsedJSON: any[],
    folderName: string
): convertedLevel {
    let convertedMap: string =
        UEFNLabelStrings.beginMap + UEFNLabelStrings.beginLevel;

    const alreadyProcessed: string[] = [];

    parsedJSON.forEach((element) => {
        let convertedObject = "";

        const objName: string = element.Name;

        if (objName === "PersistentLevel") {
            return;
        }

        let locationDataObj: any = undefined;

        parsedJSON.forEach((dataObj) => {
            if (dataObj.Outer) {
                if (dataObj.Outer === objName) {
                    locationDataObj = dataObj;
                }
            }
        });

        if (typeof locationDataObj === "undefined") {
            return;
        }

        if (!element.Template) {
            if (!element.Properties.StaticMesh) {
                if (!locationDataObj.Template) {
                    if (!locationDataObj.Properties?.StaticMesh) {
                        return;
                    }
                }
            }
        }

        const staticMeshToUse =
            typeof element.Properties.StaticMesh === "undefined"
                ? typeof locationDataObj.Properties.StaticMesh === "undefined"
                    ? undefined
                    : locationDataObj.Properties.StaticMesh
                : element.Properties.StaticMesh;

        const staticMeshPath: string = new StaticMesh(
            staticMeshToUse
        ).convertToUEFN();

        const templateToUse = !element.Template
            ? !element.Properties.StaticMesh
                ? !locationDataObj.Template
                    ? !locationDataObj.Properties.StaticMesh
                        ? undefined
                        : locationDataObj.Properties.StaticMesh
                    : locationDataObj.Template
                : element.Properties.StaticMesh
            : element.Template;

        const properties = element.Properties;
        const locationDataProperties = locationDataObj.Properties;
        const objPath: string = new Template(templateToUse).convertToUEFN(
            staticMeshPath !== ""
        );

        const overrideMaterials: string[] = [""];
        if (locationDataProperties.OverrideMaterials) {
            for (
                let index = 0;
                index < locationDataProperties.OverrideMaterials.length;
                index++
            ) {
                const element = locationDataProperties.OverrideMaterials[index];
                if (element === null) {
                    continue;
                } else {
                    overrideMaterials.push(
                        new OverrideMaterials(element).convertToUEFN(index)
                    );
                }
            }
        }

        let relativeLocation: string = "";

        if (locationDataProperties.RelativeLocation) {
            relativeLocation = new RelativeLocation(
                locationDataProperties.RelativeLocation.X,
                locationDataProperties.RelativeLocation.Y,
                locationDataProperties.RelativeLocation.Z
            ).convertToUEFN();
        } else {
            return;
        }

        let relativeRotation: string = "";

        if (locationDataProperties.RelativeRotation) {
            relativeRotation = new RelativeRotation(
                locationDataProperties.RelativeRotation.Pitch,
                locationDataProperties.RelativeRotation.Yaw,
                locationDataProperties.RelativeRotation.Roll
            ).convertToUEFN();
        }

        let relativeScale: string = "";

        if (locationDataProperties.RelativeScale3D) {
            relativeScale = new RelativeScale(
                locationDataProperties.RelativeScale3D.X,
                locationDataProperties.RelativeScale3D.Y,
                locationDataProperties.RelativeScale3D.Z
            ).convertToUEFN();
        }

        let textureData: string[] = [];
        let textureIndex: number = 0;

        Object.keys(properties).forEach((key) => {
            if (key.includes("TextureData-")) {
                textureData.push(
                    new TextureData(properties[key]).convertToUEFN(textureIndex)
                );
                textureIndex++;
            } else if (key.includes("TextureData")) {
                console.warn(
                    "Warning! JSON covertion for TextureData wasnt successful! TextureData will not be used!"
                );
            }
        });

        let lodData: string = "";

        if (locationDataObj.LODData) {
            lodData = new LODData(locationDataObj.LODData).convertToUEFN();
        }

        let resourceType = "";

        if (properties.ResourceType) {
            resourceType = `${tabIndent(3)}ResourceType=${
                properties.ResourceType.split(":")[2]
            }\n`;
        }

        convertedObject += objPath;
        convertedObject += UEFNLabelStrings.beginObject;
        convertedObject += staticMeshPath;
        overrideMaterials.forEach((element) => {
            convertedObject += element;
        });
        convertedObject += relativeLocation;
        convertedObject += relativeRotation;
        convertedObject += relativeScale;
        convertedObject += lodData;
        convertedObject += UEFNLabelStrings.endObject;
        textureData.forEach((element) => {
            convertedObject += element;
        });
        convertedObject += resourceType;
        convertedObject += UEFNLabelStrings.meshComponent;
        convertedObject += UEFNLabelStrings.boxComponent;
        // convertedObject += UEFNLabelStrings.fortFX;
        convertedObject += UEFNLabelStrings.editorOnlyMesh;
        convertedObject += UEFNLabelStrings.rootComponent;
        convertedObject += UEFNLabelStrings.actorLabel(objName);
        if (folderName) {
            convertedObject += UEFNLabelStrings.folderPath(folderName);
        }
        convertedObject += UEFNLabelStrings.endActor;

        convertedMap += convertedObject;
        alreadyProcessed.push(objName);
    });

    convertedMap += UEFNLabelStrings.endLevel;
    convertedMap += UEFNLabelStrings.surface;
    convertedMap += UEFNLabelStrings.endMap;

    return {
        fileName: folderName,
        fileContent: convertedMap,
        dateCreated: new Date(),
        warnings: "", // TODO Change this
    };
}

export function writeFile() {}
