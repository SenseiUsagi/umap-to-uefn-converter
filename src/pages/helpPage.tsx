import React from "react";
import { Header, Image, Segment } from "semantic-ui-react";
import { Column, Container, Row } from "../components/gridsystem";
import GlobalStore, { GlobalState } from "../state/globalstate";
import doesntValidate from "../assets/img/iT_dOeSnT_vAlIdAtE.png";

function HelpPage() {
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
							<Header size="huge">Help / Q&A</Header>
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
							<Header size="large">What does this converter do?</Header>
						</Segment>
					</Column>
				</Row>
				<Row>
					<Column size={6}>
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<Header size="medium">
								This converter takes .umap files (pre converted to .json) and
								converts it into something you can copy paste into UEFN.
							</Header>
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
							<Header size="large">
								Where do I get .json versions of .umap files?
							</Header>
						</Segment>
					</Column>
				</Row>
				<Row>
					<Column size={6}>
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<Header size="medium">
								You use a Programm called{" "}
								<a
									href="https://fmodel.app/"
									target="_blank"
									rel="noopener noreferrer"
								>
									FModel.
								</a>{" "}
								It lets you browse through the games files (not limited to
								Fortnite), export textures, models and .json versions of certain
								files (like .umap)
							</Header>
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
							<Header size="large">
								How do I get the converted level into UEFN?
							</Header>
						</Segment>
					</Column>
				</Row>
				<Row>
					<Column size={6}>
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<Header size="medium">
								Copy the text from the text area, then go into UEFN and press CTRL +
								V. <br /> (I recommend doing this in an empty level)
							</Header>
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
							<Header size="large">
								My converted level doesnt have roads and paths painted
							</Header>
						</Segment>
					</Column>
				</Row>
				<Row>
					<Column size={6}>
						{/* TODO: Make a tutorial and figure out how to compile shit in C# */}
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<Header size="medium">
								Your FModel doesnt export Vertex-Color-Data. I have an already
								modified version of FModel you can download{" "}
								<a
									href="https://drive.google.com/file/d/1FxLy1LdTkFn7dHzAX-b8t1QRwH1lp4i6/view?usp=drive_link"
									target="_blank"
									rel="noopener noreferrer"
								>
									here
								</a>
								. <br /> (Note: when using the already modified one, it will be
								outdated, have a lot more files than just the .exe because its
								technically a debugging version, <br /> be very unstable and crash
								unexpectedly and also dont update it if it asks you to update it)
							</Header>
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
							<Header size="large">
								I used a converted map in my project and now it doesnt validate
							</Header>
						</Segment>
					</Column>
				</Row>
				<Row>
					<Column size={6}>
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<Image src={doesntValidate} fluid size="big" centered />
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
							<Header size="large">
								I found a bug or I want to provide feedback
							</Header>
						</Segment>
					</Column>
				</Row>
				<Row>
					<Column size={6}>
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<Header size="medium">
								For bugs and feedback create an issue on{" "}
								<a
									href="https://github.com/SenseiUsagi/umap-to-uefn-converter/issues"
									target="_blank"
									rel="noopener noreferrer"
								>
									Github
								</a>{" "}
								with their respective labels (bug & enhancement).
							</Header>
						</Segment>
					</Column>
				</Row>
			</Container>
		</>
	);
}

export default HelpPage;
