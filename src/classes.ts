import { portedMaterialsPaths, portedModelsPaths } from "./assets/data/modelsInfo";
import {
	tabIndent,
	ObjectData,
	LODObj,
	UEFNLabelStrings,
	editorObject,
	rgbaToHex,
} from "./constants";
import GlobalStore, { GlobalState } from "./state/globalstate";

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
		return `${tabIndent(4)}RelativeLocation=(X=${this.X},Y=${this.Y},Z=${this.Z})\n`;
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
		return `${tabIndent(4)}RelativeRotation=(Pitch=${this.Pitch},Yaw=${this.Yaw},Roll=${
			this.Roll
		})\n`;
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
		return `${tabIndent(4)}RelativeScale3D=(X=${this.X},Y=${this.Y},Z=${this.Z})\n`;
	}
}

export class Template {
	ObjData: ObjectData;

	constructor(ObjData: ObjectData) {
		this.ObjData = ObjData;
	}

	convertToUEFN(isStaticMesh: boolean): string {
		const globalState: GlobalState = GlobalStore.getState();
		if (isStaticMesh) {
			// Dev check for unreal 5 project
			if (globalState.currentSettings.portedModelsProjectName === "Game") {
				return UEFNLabelStrings.beginActor("/Script/Engine.StaticMeshActor");
			} else {
				return UEFNLabelStrings.beginActor("/Script/FortniteGame.FortStaticMeshActor");
			}
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
		const globalState: GlobalState = GlobalStore.getState();
		let tempMeshName: string = "";

		if (!this.MeshData) {
			return "";
		}

		if (globalState.currentSettings.exportNoTerrain) {
			if (
				this.MeshData.ObjectPath.includes("DS_Fortnite_Terrain_NoLOD") ||
				this.MeshData.ObjectPath.includes("Environments/World/Sidewalks") ||
				this.MeshData.ObjectPath.includes("S_Road") ||
				this.MeshData.ObjectPath.includes("S_Asphalt") ||
				this.MeshData.ObjectPath.includes("S_SmallStreet") ||
				this.MeshData.ObjectPath.includes("S_Water") ||
				this.MeshData.ObjectPath.includes("BP_Athena_Water") ||
				this.MeshData.ObjectPath.includes("S_Basketball") ||
				this.MeshData.ObjectPath.includes("S_Sidewalk")
			) {
				return "";
			}
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

		let mesh = tempMeshPath + tempMeshName;
		if (globalState.currentSettings.usePortedModels) {
			const portedMesh: String | undefined = portedModelsPaths[tempMeshName];
			if (typeof portedMesh != "undefined") {
				mesh = `/${globalState.currentSettings.portedModelsProjectName + portedMesh}`;
			}
		}

		return UEFNLabelStrings.staticMesh(mesh);
	}
}

export class OverrideMaterials {
	Materials: ObjectData[] | null[];

	constructor(overrideMaterials: ObjectData[] | null[]) {
		this.Materials = overrideMaterials;
	}

	convertToUEFN(): string {
		const globalState: GlobalState = GlobalStore.getState();
		const overrideMaterials: string[] = [];
		for (let index = 0; index < this.Materials.length; index++) {
			const element = this.Materials[index];
			if (element === null) {
				continue;
			} else {
				let tempMeshName: string = element.ObjectName;
				let tempMeshPath: string = element.ObjectPath;

				if (tempMeshName.includes("MaterialInstanceConstant'")) {
					tempMeshName = tempMeshName.split("MaterialInstanceConstant'")[1];
				}

				tempMeshPath = tempMeshPath.replace("FortniteGame/Content", "/Game");
				tempMeshPath = tempMeshPath.replace(/\d+$/, "");

				let material = tempMeshPath + tempMeshName;
				if (globalState.currentSettings.usePortedModels) {
					const portedMaterial: String | undefined = portedMaterialsPaths[tempMeshName];

					const biomeKey = (
						Object.keys(globalState.currentSettings.overrideBiome) as Array<
							keyof typeof globalState.currentSettings.overrideBiome
						>
					).find((key) => globalState.currentSettings.overrideBiome[key] === true);
					if (typeof portedMaterial !== "undefined") {
						material = `/${
							globalState.currentSettings.portedModelsProjectName + portedMaterial
						}`;
					} else if (typeof biomeKey !== "undefined") {
						material = `/${
							globalState.currentSettings.portedModelsProjectName + material
						}`;
					}
				}

				overrideMaterials.push(
					`${tabIndent(
						4
					)}OverrideMaterials(${index})="/Script/Engine.MaterialInstanceConstant'${material}"\n`
				);
			}
		}
		let materials = "";
		overrideMaterials.forEach((element) => {
			materials += element;
		});

		return materials;
	}
}

export class LODData {
	LODData: LODObj[];

	constructor(LODData: LODObj[]) {
		this.LODData = LODData;
	}

	convertToUEFN(): string {
		let tempLodData: string = "";

		if (this.LODData) {
			this.LODData.forEach((element, index) => {
				if (element.OverrideVertexColors !== undefined) {
					const numVertices: number = element.OverrideVertexColors.NumVertices;
					let colorData: string = "";
					if (typeof element.OverrideVertexColors.Data !== "undefined") {
						if (typeof element.OverrideVertexColors.Data[0] === "string") {
							element.OverrideVertexColors.Data.forEach((color, colorIndex) => {
								colorData += `${color}${
									colorIndex !== element.OverrideVertexColors!.Data.length - 1
										? ","
										: ""
								}`;
							});

							tempLodData += `${tabIndent(
								4
							)}CustomProperties CustomLODData LOD=${index} ColorVertexData(${numVertices})=(${colorData})\n`;
						} else if (typeof element.OverrideVertexColors.Data[0] === "object") {
							element.OverrideVertexColors.Data.forEach((color, colorIndex) => {
								if (typeof color === "object") {
									if (typeof color.Hex === "string") {
										colorData += `${color.Hex}${
											colorIndex !==
											element.OverrideVertexColors!.Data.length - 1
												? ","
												: ""
										}`;
									} else {
										colorData += `${rgbaToHex(
											color.R,
											color.G,
											color.B,
											color.A
										)}${
											colorIndex !==
											element.OverrideVertexColors!.Data.length - 1
												? ","
												: ""
										}`;
									}

									tempLodData += `${tabIndent(
										4
									)}CustomProperties CustomLODData LOD=${index} ColorVertexData(${numVertices})=(${colorData})\n`;
								}
							});
						}
					}
				}
			});
		}
		return tempLodData;
	}
}

export class TextureData {
	textureData: ObjectData[];

	constructor(textureData: ObjectData[]) {
		this.textureData = textureData;
	}

	convertToUEFN(): string {
		const globalState: GlobalState = GlobalStore.getState();

		const textureData: string[] = [];

		for (let index = 0; index < this.textureData.length; index++) {
			const element = this.textureData[index];

			if (index > 3 || index < 0) {
				throw Error("Texture Index Out of bounds", {
					cause: "Texture Index is greater than 3 or smaller than 0. Programming error",
				});
			}

			if (element === null) {
				continue;
			}

			let tempName = element.ObjectName.split("'")[1] + "'";

			let tempObjPath = element.ObjectPath;

			tempObjPath = tempObjPath.replace("FortniteGame/Content", "/Game");
			tempObjPath = tempObjPath.replace(/\d+$/, "");
			if (globalState.currentSettings.tryToAutoFixTextureData) {
				tempObjPath = tempObjPath.replace("Diffuses/", "");
			}

			textureData.push(
				`${tabIndent(
					3
				)}TextureData(${index})="/Script/FortniteGame.BuildingTextureData'${tempObjPath}${tempName}"\n`
			);
		}

		let textures = "";
		textureData.forEach((element) => {
			textures += element;
		});

		return textures;
	}
}

export class ResourceType {
	resourceType: string;
	constructor(resourceType: string) {
		this.resourceType = resourceType;
	}

	convertToUEFN() {
		return UEFNLabelStrings.resourceType(this.resourceType.split(":")[2]);
	}
}

export class Sound {
	soundData: ObjectData;

	constructor(soundData: ObjectData) {
		this.soundData = soundData;
	}

	convertToUEFN(): string {
		let tempSoundName: string = "";

		if (!this.soundData) {
			return "";
		}

		if (this.soundData.ObjectName.includes("SoundCue'")) {
			tempSoundName = this.soundData.ObjectName.split("SoundCue'")[1];
		} else if (this.soundData.ObjectName.includes(":")) {
			tempSoundName = this.soundData.ObjectName.split(":")[0];
		}

		tempSoundName = tempSoundName.replace(/_+$/, "");

		let tempSoundPath: string = this.soundData.ObjectPath;

		tempSoundPath = tempSoundPath.replace("FortniteGame/Content", "/Game");
		tempSoundPath = tempSoundPath.replace(/\d+$/, "");

		return UEFNLabelStrings.sound(tempSoundPath + tempSoundName);
	}
}

export class UEFNObject {
	data: editorObject;
	endOfObject: boolean;
	objectName?: string | undefined;

	constructor(
		data: editorObject,
		endOfObject: boolean,
		objectName: string | undefined = undefined
	) {
		this.data = data;
		this.endOfObject = endOfObject;
		this.objectName = objectName;
	}

	convertToUEFN(): string {
		let staticMeshPath: string = "";
		if (this.data.staticMesh !== null) {
			staticMeshPath = this.data.staticMesh.convertToUEFN();
		}

		let overrideMaterials: string = "";
		if (this.data.overrideMaterials !== null) {
			overrideMaterials = this.data.overrideMaterials.convertToUEFN();
		}

		let relativeLocation: string = "";
		if (this.data.relativeLocation !== null) {
			relativeLocation = this.data.relativeLocation.convertToUEFN();
		}

		let relativeRotation: string = "";
		if (this.data.relativeRotation !== null) {
			relativeRotation = this.data.relativeRotation.convertToUEFN();
		}

		let relativeScale: string = "";
		if (this.data.relativeScale !== null) {
			relativeScale = this.data.relativeScale.convertToUEFN();
		}

		const textureData: string =
			this.data.textureData !== null ? this.data.textureData!.convertToUEFN() : "";

		let lodData: string = "";
		if (this.data.lodData !== null) {
			lodData = this.data.lodData.convertToUEFN();
		}

		let resourceType: string = "";
		if (this.data.resourceType !== null) {
			resourceType = this.data.resourceType.convertToUEFN();
		}

		let sound: string = "";
		if (this.data.sound !== null) {
			sound = this.data.sound.convertToUEFN();
		}

		let convertedObject: string = "";
		convertedObject += UEFNLabelStrings.beginObject(this.objectName);
		convertedObject += staticMeshPath;
		convertedObject += overrideMaterials;
		convertedObject += sound;
		convertedObject += relativeLocation;
		convertedObject += relativeRotation;
		convertedObject += relativeScale;
		convertedObject += lodData;
		convertedObject += UEFNLabelStrings.endObject;
		convertedObject += textureData;
		convertedObject += this.data.mirrored ? UEFNLabelStrings.mirrored : "";
		convertedObject += resourceType;
		convertedObject += UEFNLabelStrings.customMaterial;
		if (!this.endOfObject) {
			convertedObject += UEFNLabelStrings.editorOnlyMesh;
			convertedObject += UEFNLabelStrings.rootComponent;
			convertedObject += UEFNLabelStrings.actorLabel(this.data.actorLabel);
			convertedObject += UEFNLabelStrings.folderPath(this.data.folderPath);
		}

		return convertedObject;
	}
}
