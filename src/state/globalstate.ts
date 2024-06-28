import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Pages, convertedLevel, defaultSettings, settings } from "../constants";

interface setFile {
    (file: File): void;
}

interface setConvertion {
    (level: convertedLevel): void;
}

interface setPage {
    (page: Pages): void;
}

interface setSettings {
    (updatedSetting: settings): void;
}

export interface GlobalState {
    uploadedFile: File | undefined;
    lastConvertedFile: convertedLevel | undefined;
    currentSettings: settings;
    currentPage: Pages;
    setUploadedFile: setFile;
    setLastConvertedFile: setConvertion;
    changeCurrentPage: setPage;
    changeSettings: setSettings;
}

const store = () => {
    if (typeof window !== undefined) {
        window.sessionStorage.removeItem("globalState");
    }

    return create<GlobalState>()(
        persist(
            (set) => ({
                uploadedFile: undefined,
                lastConvertedFile: undefined,
                currentSettings: defaultSettings,
                currentPage: Pages.CONVERTER,
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
                changeCurrentPage: (page) => {
                    set(() => {
                        return {
                            currentPage: page,
                        };
                    });
                },
                changeSettings: (updatedSetting) => {
                    set(() => {
                        return {
                            currentSettings: updatedSetting,
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
