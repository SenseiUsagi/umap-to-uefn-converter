import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
	Pages,
	PopUpTypes,
	convertedLevel,
	defaultSettings,
	settings,
	voidFunciton,
} from "../constants";
import { json } from "stream/consumers";

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

export interface GlobalState {
	uploadedFile: File | undefined;
	lastConvertedFile: convertedLevel | undefined;
	currentSettings: settings;
	currentPage: Pages;
	popUp: popUp;
	setUploadedFile: setFile;
	setLastConvertedFile: setConvertion;
	changeCurrentPage: setPage;
	changeSettings: setSettings;
	openPopUp: openPopup;
	closePopUp: voidFunciton;
}

const store = () => {
	window.sessionStorage.removeItem("globalState");
	const saveSettings: settings | undefined =
		window.localStorage.getItem("uefnConverterSettings") != null
			? JSON.parse(window.localStorage.getItem("uefnConverterSettings")!)
			: undefined;

	return create<GlobalState>()(
		persist(
			(set) => ({
				uploadedFile: undefined,
				lastConvertedFile: undefined,
				currentSettings: saveSettings == undefined ? defaultSettings : saveSettings,
				currentPage: Pages.CONVERTER,
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
				changeCurrentPage: (page) => {
					set(() => {
						return {
							currentPage: page,
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
