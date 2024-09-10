import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
    PopUpTypes,
    booleanFunction,
    convertedLevel,
    defaultSettings,
    settings,
    voidFunction,
} from "../constants";

interface setFile {
    (file: File): void;
}

interface setConvertion {
    (level: convertedLevel): void;
}

interface setSettings {
    (updatedSetting: settings): void;
}

interface popUp {
    title: string | null;
    content: string | null;
    isOpen: boolean;
    type: PopUpTypes | null;
    animationStarted: Date | null;
}

interface openPopup {
    (popUp: { title: string; content: string; type: PopUpTypes }): void;
}

interface incrementFilesConverted {
    (): void;
}

export function useOverrideBiome(globalState: GlobalState): boolean {
    let useOverrideBiome: boolean = false;

    Object.keys(globalState.currentSettings.overrideBiome).forEach((key) => {
        if (
            globalState.currentSettings.overrideBiome[
                key as keyof typeof globalState.currentSettings.overrideBiome
            ]
        ) {
            if (key !== "forceCave") {
                useOverrideBiome = true;
            }
        }
    });

    return useOverrideBiome;
}

export interface GlobalState {
    uploadedFile: File | undefined;
    lastConvertedFile: convertedLevel | undefined;
    currentSettings: settings;
    popUp: popUp;
    totalFilesConverted: number;
    setUploadedFile: setFile;
    setLastConvertedFile: setConvertion;
    changeSettings: setSettings;
    openPopUp: openPopup;
    closePopUp: voidFunction;
    incrementConvertedFiles: incrementFilesConverted;
}

const store = () => {
    window.sessionStorage.removeItem("globalState");
    const saveSettings: settings | undefined =
        window.localStorage.getItem("uefnConverterSettings") !== null
            ? JSON.parse(window.localStorage.getItem("uefnConverterSettings")!)
            : undefined;

    const filesConverted: number | undefined =
        window.localStorage.getItem("uefnConverterCounter") !== null
            ? JSON.parse(window.localStorage.getItem("uefnConverterCounter")!)
            : undefined;

    return create<GlobalState>()(
        persist(
            (set) => ({
                uploadedFile: undefined,
                lastConvertedFile: undefined,
                currentSettings:
                    saveSettings === undefined ? defaultSettings : saveSettings,
                totalFilesConverted:
                    filesConverted === undefined ? 0 : filesConverted,
                popUp: {
                    title: null,
                    content: null,
                    isOpen: false,
                    type: null,
                    animationStarted: null,
                },
                setUploadedFile: (file) => {
                    set(() => {
                        return {
                            uploadedFile: file,
                        };
                    });
                },
                setLastConvertedFile: (level) => {
                    set(() => {
                        return {
                            lastConvertedFile: level,
                        };
                    });
                },
                changeSettings: (updatedSetting) => {
                    set(() => {
                        window.localStorage.setItem(
                            "uefnConverterSettings",
                            JSON.stringify(updatedSetting)
                        );
                        return {
                            currentSettings: updatedSetting,
                        };
                    });
                },
                openPopUp: ({ title, content, type }) => {
                    set((state) => {
                        if (typeof title === "string") {
                            if (typeof content === "string") {
                                return {
                                    popUp: {
                                        title: title,
                                        content: content,
                                        isOpen: true,
                                        type: type,
                                        animationStarted: new Date(),
                                    },
                                };
                            }
                        }
                        return { ...state };
                    });
                },
                closePopUp: () => {
                    set((state) => ({
                        popUp: {
                            title: state.popUp.title,
                            content: state.popUp.content,
                            isOpen: false,
                            type: state.popUp.type,
                            animationStarted: null,
                        },
                    }));
                },
                incrementConvertedFiles: () => {
                    set((state) => {
                        window.localStorage.setItem(
                            "uefnConverterCounter",
                            `${state.totalFilesConverted + 1}`
                        );
                        return {
                            totalFilesConverted: state.totalFilesConverted + 1,
                        };
                    });
                },
            }),
            {
                name: "globalState",
                storage: createJSONStorage(() => sessionStorage),
            }
        )
    );
};

const GlobalStore = store();

export default GlobalStore;
