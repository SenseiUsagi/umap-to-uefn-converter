import React from "react";
import { Checkbox, Header, Segment } from "semantic-ui-react";
import GlobalStore, { GlobalState } from "../state/globalstate";
import { Column, Container, Row } from "../components/gridsystem";

function SettingsPage() {
	const globalState: GlobalState = {
		...GlobalStore((state) => state),
	};
	return (
		<>
			<div style={{ minHeight: "2.85714286em" }}></div>

			<Container>
				<Row>
					<Column size={6}>
						<Segment
							raised
							padded="very"
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<Header size="huge">Settings</Header>
						</Segment>
					</Column>
				</Row>
				<Row>
					<Column size={6}>
						<Segment
							raised
							padded="very"
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<Header size="large">Darkmode</Header>
							<Checkbox
								toggle
								onChange={() => {
									globalState.changeSettings({
										...globalState.currentSettings,
										darkMode: !globalState.currentSettings.darkMode,
									});
								}}
								checked={globalState.currentSettings.darkMode}
							/>
						</Segment>
					</Column>
				</Row>
				<Row>
					<Column size={2}>
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<div style={{ height: "15rem" }}>
								<Header
									size="medium"
									inverted={globalState.currentSettings.darkMode}
								>
									Export only terrain
								</Header>
								<Header
									size="small"
									inverted={globalState.currentSettings.darkMode}
								>
									Only export the terrain of a json file
								</Header>
								<Checkbox
									toggle
									onChange={() => {
										globalState.changeSettings({
											...globalState.currentSettings,
											exportOnlyTerrain:
												!globalState.currentSettings.exportOnlyTerrain,
											exportNoTerrain: globalState.currentSettings
												.exportNoTerrain
												? false
												: globalState.currentSettings.exportNoTerrain,
										});
									}}
									checked={globalState.currentSettings.exportOnlyTerrain}
								/>
							</div>
						</Segment>
					</Column>
					<Column size={2}>
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<div style={{ height: "15rem" }}>
								<Header
									size="medium"
									inverted={globalState.currentSettings.darkMode}
								>
									Export only buildings
								</Header>
								<Header
									size="small"
									inverted={globalState.currentSettings.darkMode}
								>
									Only export the buildings of a json file
								</Header>
								<Checkbox
									toggle
									onChange={() => {
										globalState.changeSettings({
											...globalState.currentSettings,
											exportNoTerrain:
												!globalState.currentSettings.exportNoTerrain,
											exportOnlyTerrain: globalState.currentSettings
												.exportOnlyTerrain
												? false
												: globalState.currentSettings.exportOnlyTerrain,
										});
									}}
									checked={globalState.currentSettings.exportNoTerrain}
								/>
							</div>
						</Segment>
					</Column>
					<Column size={2}>
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<div style={{ height: "15rem" }}>
								<Header
									size="medium"
									inverted={globalState.currentSettings.darkMode}
								>
									Try to autofix broken texture data
								</Header>
								<Header
									size="small"
									inverted={globalState.currentSettings.darkMode}
								>
									Over the time the path for texture data has changed. This
									setting will try to automatically fix the path for the newest
									version
								</Header>
								<Checkbox
									toggle
									onChange={() => {
										globalState.changeSettings({
											...globalState.currentSettings,
											tryToAutoFixTextureData:
												!globalState.currentSettings
													.tryToAutoFixTextureData,
										});
									}}
									checked={globalState.currentSettings.tryToAutoFixTextureData}
								/>
							</div>
						</Segment>
					</Column>
					{/* TODO: Fix folder name not saving in local storage */}
					{/* <Column size={1.5}>
					<Segment raised textAlign="center">
						<div style={{ height: "15rem" }}>
							<Header size="medium">Custom Folder name</Header>
							<Header size="small">
								The converted actors are automatically placed inside a folder
								(usually the file name of the json). Here you can provide a custom
								folder name.
							</Header>
							<Input
								type="text"
								placeholder="Default is filename"
								value={globalState.currentSettings.customFolderName}
								onChange={(event: any) => {
									globalState.changeSettings({
										...globalState.currentSettings,
										customFolderName: event.value,
									});
								}}
							/>
						</div>
					</Segment>
				</Column> */}
				</Row>
				<Row>
					<Column size={6}>
						<Segment
							raised
							padded="very"
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<Header size="large">
								Use recreated terrain instead of the one from the game (Coming soon)
							</Header>
							<Header size="medium">
								This option tries to use the terrain models I have ported to UEFN
								instead of the ones from the game. You can find the recreated
								terrain{" "}
								<a
									href="https://drive.google.com/file/d/1KAaowKJp-TpYEk4j0GPjBfEWraAf1sL9/view?usp=drive_link"
									target="_blank"
									rel="noopener noreferrer"
								>
									here
								</a>
								.
							</Header>
							<Checkbox disabled toggle />
						</Segment>
					</Column>
				</Row>
			</Container>
		</>
	);
}

export default SettingsPage;
