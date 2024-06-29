import React from "react";
import NavigationBar from "./components/navigationBar";
import ConverterPage from "./components/pages/converterPage";
import AboutPage from "./components/pages/aboutPage";
import ExamplesPage from "./components/pages/examplesPage";
import SettingsPage from "./components/pages/settings";
import NotifyPopUp from "./components/popUp";
import GlobalStore, { GlobalState } from "./state/globalstate";
import { Pages } from "./constants";

function App() {
	const globalState: GlobalState = {
		...GlobalStore((state) => state),
	};

	const convertionPage = ConverterPage();
	const aboutPage = AboutPage();
	const examplePage = ExamplesPage();
	const settingsPage = SettingsPage();
	// TODO: Add a 404 page

	return (
		<>
			<NavigationBar />
			<div style={{ minHeight: "2.85714286em" }}></div>
			{globalState.currentPage === Pages.CONVERTER
				? convertionPage
				: globalState.currentPage === Pages.ABOUT
				? aboutPage
				: globalState.currentPage === Pages.EXAMPLES
				? examplePage
				: globalState.currentPage === Pages.SETTINGS
				? settingsPage
				: "Add 404"}
			<NotifyPopUp />
		</>
	);
}

export default App;
