import { ReactNode } from "react";
import {
    LODData,
    OverrideMaterials,
    RelativeLocation,
    RelativeRotation,
    RelativeScale,
    ResourceType,
    Sound,
    StaticMesh,
    TextureData,
} from "./classes";
// ===== General =====

export function tabIndent(amount: number): string {
    const tab: string = "    ";
    let indents: string = "";

    for (let index = 0; index < amount; index++) {
        indents += tab;
    }

    return indents;
}

export function rgbaToHex(r: number, g: number, b: number, a: number): string {
    // Ensure each component is within the valid range
    if (
        r < 0 ||
        r > 255 ||
        g < 0 ||
        g > 255 ||
        b < 0 ||
        b > 255 ||
        a < 0 ||
        a > 255
    ) {
        throw new Error("RGBA values must be between 0 and 255");
    }

    // Convert each component to a two-digit hex string
    const toHex = (component: number): string =>
        component.toString(16).padStart(2, "0");

    const redHex = toHex(r);
    const greenHex = toHex(g);
    const blueHex = toHex(b);
    const alphaHex = toHex(a); // Assuming alpha is already in the 0-255 range

    return `#${redHex}${greenHex}${blueHex}${alphaHex}`;
}

export const UEFNLabelStrings = {
    beginMap: "Begin Map\n",
    beginLevel: `${tabIndent(1)}Begin Level\n\n`,
    beginActor: (objPath: string) =>
        `${tabIndent(2)}Begin Actor Class="${objPath}"\n`,
    beginObject: (name: string | undefined) =>
        `${tabIndent(3)}Begin Object Name="${
            name !== undefined ? name : "StaticMeshComponent0"
        }"\n`,
    staticMesh: (meshPathName: string) =>
        `${tabIndent(
            4
        )}StaticMesh="/Script/Engine.StaticMesh'${meshPathName}"\n`,
    endObject: `${tabIndent(3)}End Object\n`,
    fortFX: `${tabIndent(3)}FortFXCustomization="FortFXCustomization"\n`,
    boxComponent: `${tabIndent(3)}BoxComponent="BoundingBoxComponent"\n`,
    editorOnlyMesh: `${tabIndent(
        3
    )}EditorOnlyStaticMeshComponent="EditorOnlyStaticMeshComponent"\n`,
    meshComponent: `${tabIndent(
        3
    )}StaticMeshComponent="StaticMeshComponent0"\n`,
    rootComponent: `${tabIndent(3)}RootComponent="StaticMeshComponent0"\n`,
    actorLabel: (label: string) => `${tabIndent(3)}ActorLabel="${label}"\n`,
    folderPath: (path: string) => `${tabIndent(3)}FolderPath="${path}"\n`,
    endActor: `${tabIndent(2)}End Actor\n\n`,
    endLevel: `${tabIndent(1)}End Level\n\n`,
    surface: "Begin Surface\nEnd Surface\n",
    endMap: "End Map\n\n",
    resourceType: (type: string) => `${tabIndent(3)}ResourceType=${type}\n`,
    sound: (path: string) =>
        `${tabIndent(4)}Sound="/Script/Engine.SoundCue'${path}\n`,
    customMaterial: `${tabIndent(3)}bAllowCustomMaterial=False\n`,
    mirrored: `${tabIndent(3)}bMirrored=True\n`,
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

export interface vertexColors {
    R: number;
    G: number;
    B: number;
    A: number;
    Hex: string;
}

export interface ObjectData {
    ObjectName: string;
    ObjectPath: string;
}

export interface LODObj {
    MapBuildDataId: string;
    OverrideVertexColors?: {
        Stride: number;
        NumVertices: number;
        Data: string[] | vertexColors[];
    };
}

export interface convertedLevel {
    fileName: string;
    dateCreated: Date;
    fileContent: string;
}

export interface settings {
    exportOnlyTerrain: boolean;
    exportNoTerrain: boolean;
    tryToAutoFixTextureData: boolean;
    customFolderName: string;
    usePortedModels: boolean;
    portedModelsProjectName: string;
    darkMode: boolean;
    overrideBiome: {
        adBiome: boolean;
        farmBiome: boolean;
        mountainBiome: boolean;
        snowBiome: boolean;
        swampBiome: boolean;
        forceCave: boolean;
        grasBiome: boolean;
    };
}

export interface editorObject {
    actorLabel: string;
    folderPath: string;
    staticMesh: StaticMesh | null;
    overrideMaterials: OverrideMaterials | null;
    relativeLocation: RelativeLocation | null;
    relativeRotation: RelativeRotation | null;
    relativeScale: RelativeScale | null;
    textureData: TextureData | null;
    mirrored: boolean;
    lodData: LODData | null;
    resourceType: ResourceType | null;
    sound: Sound | null;
}

export interface voidFunction {
    (): void;
}

export interface booleanFunction {
    (): boolean;
}

export const defaultSettings: settings = {
    exportOnlyTerrain: false,
    exportNoTerrain: false,
    tryToAutoFixTextureData: false,
    customFolderName: "",
    portedModelsProjectName: "Game",
    usePortedModels: false,
    darkMode: false,
    overrideBiome: {
        adBiome: false,
        farmBiome: false,
        mountainBiome: false,
        snowBiome: false,
        swampBiome: false,
        forceCave: false,
        grasBiome: false,
    },
};

export enum PopUpTypes {
    "SUCCESS",
    "WARNING",
    "ERROR",
}

export interface Biome {
    cliff: {
        brown: ObjectData;
        white: ObjectData;
        brownCave: ObjectData;
        whiteCave: ObjectData;
    };
    farmField: ObjectData;

    terrain: {
        normal: ObjectData;
        beach: ObjectData;
        forest: ObjectData;
        rural: ObjectData;
    };
    sideWalks: ObjectData;
    waterWall: ObjectData;
    waterWallSecondary: ObjectData;
    landWater: ObjectData;
    water: ObjectData;
    stream: {
        normal: {
            forward: ObjectData;
            backwards: ObjectData;
        };
        tSection: {
            forward: ObjectData;
            backwards: ObjectData;
        };
        lakeTransition: {
            forward: ObjectData;
            backwards: ObjectData;
        };
        cliff: ObjectData;
    };
}
