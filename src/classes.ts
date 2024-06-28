import { tabIndent, ObjectData, LODObj, UEFNLabelStrings } from "./constants";

export class RelativeLocation {
    X: number;
    Y: number;
    Z: number;

    constructor(X: number = 0.0, Y: number = 0.0, Z: number = 0.0) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
    }

    convertToUEFN(): string {
        return `${tabIndent(4)}RelativeLocation=(X=${this.X},Y=${this.Y},Z=${
            this.Z
        })\n`;
    }
}

export class RelativeRotation {
    Pitch: number;
    Yaw: number;
    Roll: number;
    constructor(Pitch: number = 0.0, Yaw: number = 0.0, Roll: number = 0.0) {
        this.Pitch = Pitch;
        this.Yaw = Yaw;
        this.Roll = Roll;
    }

    convertToUEFN(): string {
        return `${tabIndent(4)}RelativeRotation=(Pitch=${this.Pitch},Yaw=${
            this.Yaw
        },Roll=${this.Roll})\n`;
    }
}

export class RelativeScale {
    X: number;
    Y: number;
    Z: number;
    constructor(X: number = 1.0, Y: number = 1.0, Z: number = 1.0) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
    }

    convertToUEFN(): string {
        return `${tabIndent(4)}RelativeScale3D=(X=${this.X},Y=${this.Y},Z=${
            this.Z
        })\n`;
    }
}

export class Template {
    ObjData: ObjectData;

    constructor(ObjData: ObjectData) {
        this.ObjData = ObjData;
    }

    convertToUEFN(isStaticMesh: boolean): string {
        if (isStaticMesh) {
            return UEFNLabelStrings.beginActor(
                "/Script/FortniteGame.FortStaticMeshActor"
            );
        }
        // Objects name
        let tempObjName: string = this.ObjData.ObjectName;

        // One of these two cases show always be true
        if (tempObjName.includes("Default__")) {
            // Will result in the entity name being stored
            tempObjName = tempObjName.split("Default__")[1];
        }
        if (tempObjName.includes(":")) {
            // example: "Athena_Plant_Corn01_C"
            tempObjName = tempObjName.split(":")[0];
        }

        tempObjName = tempObjName.replace(/_+$/, "");
        tempObjName = tempObjName.replace(/'$/, "");

        // Objects directory path
        let tempObjPath: string = this.ObjData.ObjectPath;

        tempObjPath = tempObjPath.replace("FortniteGame/Content", "/Game");
        tempObjPath = tempObjPath.replace(/\d+$/, "");

        if (tempObjName === this.ObjData.ObjectName) {
            tempObjName = "/Script/FortniteGame.FortStaticMeshActor";
        }

        return UEFNLabelStrings.beginActor(tempObjPath + tempObjName);
    }
}

export class StaticMesh {
    MeshData: ObjectData;

    constructor(MeshData: ObjectData) {
        this.MeshData = MeshData;
    }

    convertToUEFN(): string {
        let tempMeshName: string = "";

        if (!this.MeshData) {
            return "";
        }

        if (this.MeshData.ObjectName.includes("StaticMesh'")) {
            tempMeshName = this.MeshData.ObjectName.split("StaticMesh'")[1];
        } else if (this.MeshData.ObjectName.includes(":")) {
            tempMeshName = this.MeshData.ObjectName.split(":")[0];
        }

        tempMeshName = tempMeshName.replace(/_+$/, "");

        let tempMeshPath: string = this.MeshData.ObjectPath;

        tempMeshPath = tempMeshPath.replace("FortniteGame/Content", "/Game");
        tempMeshPath = tempMeshPath.replace(/\d+$/, "");

        return UEFNLabelStrings.staticMesh(tempMeshPath + tempMeshName);
    }
}

export class OverrideMaterials {
    Materials: ObjectData;

    constructor(overrideMaterials: ObjectData) {
        this.Materials = overrideMaterials;
    }

    convertToUEFN(materialIndex: number): string {
        if (this.Materials == null) {
            return "";
        }

        let tempMeshName: string = "";
        let tempMeshPath: string = this.Materials.ObjectPath;

        if (this.Materials.ObjectName.includes("MaterialInstanceConstant'")) {
            tempMeshName = this.Materials.ObjectName.split(
                "MaterialInstanceConstant'"
            )[1];
        }

        tempMeshPath = tempMeshPath.replace("FortniteGame/Content", "/Game");
        tempMeshPath = tempMeshPath.replace(/\d+$/, "");

        return `${tabIndent(
            4
        )}OverrideMaterials(${materialIndex})="/Script/Engine.MaterialInstanceConstant'${
            tempMeshPath + tempMeshName
        }"\n`;
    }
}

export class LODData {
    LODData: LODObj[];

    constructor(LODData: LODObj[]) {
        this.LODData = LODData;
    }

    convertToUEFN(): string {
        let tempLodData: string = "";

        this.LODData.forEach((element, index) => {
            if (element.OverrideVertexColors !== undefined) {
                const numVertices: number =
                    element.OverrideVertexColors.NumVertices;
                let colorData: string = "";
                if (typeof element.OverrideVertexColors.Data[0] === "string") {
                    element.OverrideVertexColors.Data.forEach(
                        (color, colorIndex) => {
                            colorData += `${color}${
                                colorIndex !==
                                element.OverrideVertexColors!.Data.length - 1
                                    ? ","
                                    : ""
                            }`;
                        }
                    );

                    tempLodData += `${tabIndent(
                        4
                    )}CustomProperties CustomLODData LOD=${index} ColorVertexData(${numVertices})=(${colorData})\n`;
                } else if (
                    typeof element.OverrideVertexColors.Data === "object"
                ) {
                    // TODO: Implement code here for FModels other vertex data
                }
            } else {
                // TODO: Add warning here so users knows meshes wont be painted
                return "";
            }
        });

        return tempLodData;
    }
}

export class TextureData {
    textureData: ObjectData;

    constructor(textureData: ObjectData) {
        this.textureData = textureData;
    }

    convertToUEFN(textureIndex: number): string {
        if (textureIndex > 3 || textureIndex < 0) {
            throw Error("Texture Index Out of bounds", {
                cause: "Texture Index is greater than 3 or smaller than 0. Programming error",
            });
        }

        let tempName = this.textureData.ObjectName.split("'")[1] + "'";

        let tempObjPath = this.textureData.ObjectPath;

        tempObjPath = tempObjPath.replace("FortniteGame/Content", "/Game");
        tempObjPath = tempObjPath.replace(/\d+$/, "");

        return `${tabIndent(
            3
        )}TextureData(${textureIndex})="/Script/FortniteGame.BuildingTextureData'${tempObjPath}${tempName}"\n`;
    }
}
