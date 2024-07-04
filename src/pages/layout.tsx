import React, { useEffect } from "react";
import NavigationBar from "../components/navigationBar";
import NotifyPopUp from "../components/popUp";
import GlobalStore, { GlobalState } from "../state/globalstate";

function Layout() {
	const globalState: GlobalState = {
		...GlobalStore((state) => state),
	};

	useEffect(() => {
		document.body.style.backgroundColor = globalState.currentSettings.darkMode
			? "black"
			: "white";
	}, [globalState.currentSettings.darkMode]);

	return (
		<>
			<NavigationBar />
			<NotifyPopUp />
		</>
	);
}

export default Layout;
