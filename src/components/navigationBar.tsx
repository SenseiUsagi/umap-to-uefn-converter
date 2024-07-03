import React from "react";
import { Button, Icon, Menu, MenuItem, Reveal, RevealContent } from "semantic-ui-react";
import GlobalStore, { GlobalState } from "../state/globalstate";
import { Pages } from "../constants";
import useMobileSize from "../hooks/useMobileSize";

function NavigationBar() {
	const globalState: GlobalState = {
		...GlobalStore((state) => state),
	};

	const isMobileSize = useMobileSize();

	return (
		<Menu fixed="top" inverted size="huge" borderless>
			<MenuItem as="a" onClick={globalState.changeCurrentPage.bind(null, Pages.CONVERTER)}>
				<Icon name="file code outline" />
				Converter
			</MenuItem>
			<MenuItem as="a" onClick={globalState.changeCurrentPage.bind(null, Pages.ABOUT)}>
				<Icon name="legal" />
				Imprint
			</MenuItem>
			<MenuItem as="a" onClick={globalState.changeCurrentPage.bind(null, Pages.EXAMPLES)}>
				<Icon name="file alternate outline" />
				Examples
			</MenuItem>
			<MenuItem as="a" onClick={globalState.changeCurrentPage.bind(null, Pages.SETTINGS)}>
				<Icon name="settings" />
				Settings
			</MenuItem>
			<MenuItem as="a" onClick={globalState.changeCurrentPage.bind(null, Pages.HELP)}>
				<Icon name="help" />
				Help
			</MenuItem>
			{/* TODO: Change this to use tablet size instead */}
			{!isMobileSize && (
				<>
					<MenuItem position="right">.umap to UEFN converter</MenuItem>
					<MenuItem
						as="a"
						href="https://www.youtube.com/channel/UCbM-2vwIRZHfOxhVNU75bCQ"
						target="_blank"
						rel="noopener noreferrer"
					>
						Created by: Sensei Usagi
					</MenuItem>
				</>
			)}
		</Menu>
	);
}

export default NavigationBar;
