import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
    PopUpTypes,
    defaultSettings,
    settings,
    voidFunction,
} from "../constants";

interface setSettings {
    (updatedSetting: settings): void;
}
// 60000000 Too High
// 4500000 Too Low
const MAX_STORAGE: number = 55500000;

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

interface addJSONtoCache {
    (file: File, filePath: string): void;
}

interface cachedJSON {
    fileName: string;
    // Relative to Fortnite
    filePath: string;
    size: number;
    file: File;
    timeAdded: Date;
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
    currentSettings: settings;
    popUp: popUp;
    totalFilesConverted: number;
    cachedJsonFiles: cachedJSON[];
    changeSettings: setSettings;
    openPopUp: openPopup;
    closePopUp: voidFunction;
    incrementConvertedFiles: incrementFilesConverted;
    addJSONtoCache: addJSONtoCache;
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
                cachedJsonFiles: [],
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
                addJSONtoCache: (file: File, filePath: string) => {
                    set((state) => {
                        if (file.size > MAX_STORAGE) {
                            return { ...state };
                        }
                        const currentCachedFiles = [...state.cachedJsonFiles];
                        const curTotalSize = currentCachedFiles.reduce(
                            (accumulator, currentValue) =>
                                accumulator + currentValue.size,
                            0
                        );

                        if (curTotalSize + file.size > MAX_STORAGE) {
                            const oldestElement = currentCachedFiles.reduce(
                                (oldest, current) =>
                                    current.timeAdded < oldest.timeAdded
                                        ? current
                                        : oldest
                            );

                            currentCachedFiles.splice(
                                currentCachedFiles.indexOf(oldestElement),
                                1
                            );
                        }

                        currentCachedFiles.push({
                            file: file,
                            fileName: file.name,
                            filePath: filePath,
                            size: file.size,
                            timeAdded: new Date(),
                        });
                        return { cachedJsonFiles: currentCachedFiles };
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
