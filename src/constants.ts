import { ReactNode } from "react";
// ===== General =====

export function tabIndent(amount: number): string {
	const tab: string = "    ";
	let indents: string = "";

	for (let index = 0; index < amount; index++) {
		indents += tab;
	}

	return indents;
}

// TODO: Change this to actually use the model from FModel
function rgbaToHex(r: number, g: number, b: number, a: number) {
	// Ensure the values are within the valid range
	if (r < 0) r = 0;
	if (r > 255) r = 255;
	if (g < 0) g = 0;
	if (g > 255) g = 255;
	if (b < 0) b = 0;
	if (b > 255) b = 255;
	if (a < 0) a = 0;
	if (a > 1) a = 1;

	// Convert each component to a 2-digit hexadecimal value
	const toHex = (value: number) => {
		let hex = value.toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	};

	// Convert alpha from [0, 1] range to [0, 255] range
	const alpha = Math.round(a * 255);

	// Create the hex string
	const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(alpha)}`;

	return hex.toUpperCase();
}

export const UEFNLabelStrings = {
	beginMap: "Begin Map\n",
	beginLevel: `${tabIndent(1)}Begin Level\n\n`,
	beginActor: (objPath: string) => `${tabIndent(2)}Begin Actor Class="${objPath}"\n`,
	beginObject: `${tabIndent(3)}Begin Object Name="StaticMeshComponent0"\n`,
	staticMesh: (meshPathName: string) =>
		`${tabIndent(4)}StaticMesh="/Script/Engine.StaticMesh'${meshPathName}"\n`,
	endObject: `${tabIndent(3)}End Object\n`,
	fortFX: `${tabIndent(3)}FortFXCustomization="FortFXCustomization"\n`,
	boxComponent: `${tabIndent(3)}BoxComponent="BoundingBoxComponent"\n`,
	editorOnlyMesh: `${tabIndent(
		3
	)}EditorOnlyStaticMeshComponent="EditorOnlyStaticMeshComponent"\n`,
	meshComponent: `${tabIndent(3)}StaticMeshComponent="StaticMeshComponent0"\n`,
	rootComponent: `${tabIndent(3)}RootComponent="StaticMeshComponent0"\n`,
	actorLabel: (label: string) => `${tabIndent(3)}ActorLabel="${label}"\n`,
	folderPath: (path: string) => `${tabIndent(3)}FolderPath="${path}"\n`,
	endActor: `${tabIndent(2)}End Actor\n\n`,
	endLevel: `${tabIndent(1)}End Level\n\n`,
	surface: "Begin Surface\nEnd Surface\n",
	endMap: "End Map\n\n",
};

export function processJSON(rawJson: string): unknown[] {
	let counter = 1;

	// Initialize the output array
	let outputArray: string[] = [];

	// Split the input string into lines
	const inputLines = rawJson.split("\n");

	// Process each line and add to the output array
	inputLines.forEach((line: string) => {
		if (line.includes('"TextureData"')) {
			line = line.replace(/TextureData/g, `TextureData-${counter}`);
			counter++;
		}
		outputArray.push(line);
	});

	// Join the output array into a single string
	const outputString = outputArray.join("\n");

	return JSON.parse(outputString);
}

export interface childrenProps {
	children: ReactNode;
}

export interface childrenPropsOptional {
	children?: ReactNode;
}

export const convertionErrors = {
	NOVERTEXDATA:
		"No vertex data found! Your FModel probably doesnt export the vertex data in your JSON. This means that terrain models wont have roads, paths, etc. To fix this watch this tutorial.",
};

// ===== Interfaces =====

export interface ObjectData {
	ObjectName: string;
	ObjectPath: string;
}

export interface LODObj {
	MapBuildDataId: string;
	OverrideVertexColors?: {
		Stride: number;
		NumVertices: number;
		Data: string[]; // TODO: Change this to be also compatable with the other FModel vertex data
	};
}

export interface convertedLevel {
	fileName: string;
	dateCreated: Date;
	fileContent: string;
	warnings: string;
}

export interface settings {
	exportOnlyTerrain: boolean;
	exportNoTerrain: boolean;
	tryToAutoFixTextureData: boolean;
	customFolderName: string;
	usePortedModels: boolean;
	overrideBiome: {
		ad: boolean;
		volcano: boolean;
		farm: boolean;
		mountain: boolean;
		snow: boolean;
		swamp: boolean;
		grass: boolean;
		forceCave: boolean;
	};
}

export const defaultSettings: settings = {
	exportOnlyTerrain: false,
	exportNoTerrain: false,
	tryToAutoFixTextureData: false,
	customFolderName: "",
	usePortedModels: false,
	overrideBiome: {
		ad: false,
		volcano: false,
		farm: false,
		mountain: false,
		snow: false,
		swamp: false,
		grass: false,
		forceCave: false,
	},
};

export enum Pages {
	"CONVERTER",
	"ABOUT",
	"EXAMPLES",
	"SETTINGS",
}
