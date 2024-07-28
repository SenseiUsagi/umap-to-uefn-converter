import React, { useRef, useState } from "react";
import { Button, Form, Header, Icon, Segment, TextArea } from "semantic-ui-react";
import { Column, Container, Row } from "../components/gridsystem";
import { convertToUEFN } from "../converter";
import { PopUpTypes, convertedLevel, processJSON } from "../constants";
import GlobalStore, { GlobalState } from "../state/globalstate";
import ErrorModal from "../components/ErrorModal";

function ConverterPage() {
	const [file, setFile] = useState<File>();

	const [dragging, setDragging] = useState(false);

	const fileRef = useRef(null);
	const textRef = useRef(null);

	const [textCopied, setTextCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorTitle, setErrorTitle] = useState<String>("");
	const [errorStack, setErrorStack] = useState<String>("");
	const [errorOpen, setErrorOpen] = useState<boolean>(false);
	const [lastConvertedMap, setLastConvertedMap] = useState<convertedLevel | null>(null);

	const globalState: GlobalState = {
		...GlobalStore((state) => state),
	};

	function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		event.stopPropagation();
		setDragging(true);
	}

	function handleDragLeave(event: any) {
		event.preventDefault();
		event.stopPropagation();

		if (event.target.id === "dragDiv") {
			setDragging(false);
		}
	}

	function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		event.stopPropagation();
	}

	function handleDrop(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		event.stopPropagation();
		setDragging(false);

		if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
			if (event.dataTransfer.files.length > 1) {
				globalState.openPopUp({
					title: "Error!",
					content: "Please only upload 1 File",
					type: PopUpTypes.ERROR,
				});
				return;
			}
			const tempFile = event.dataTransfer.files[0];
			if (tempFile.type === "application/json") {
				setFile(event.dataTransfer.files[0]);
			} else {
				globalState.openPopUp({
					title: "Error!",
					content: "Uploaded file isnt JSON format",
					type: PopUpTypes.ERROR,
				});
			}
		}
	}

	function handleChange(event: any) {
		event.stopPropagation();
		if (event.target.files && event.target.files.length > 0) {
			if (event.target.files.length > 1) {
				globalState.openPopUp({
					title: "Error!",
					content: "Please only upload 1 File",
					type: PopUpTypes.ERROR,
				});
				return;
			}
			const tempFile = event.target.files[0];
			if (tempFile.type === "application/json") {
				setFile(event.target.files[0]);
			} else {
				globalState.openPopUp({
					title: "Error!",
					content: "Uploaded file isnt JSON format",
					type: PopUpTypes.ERROR,
				});
			}
		}
	}

	async function handleConvertion() {
		if (isLoading) {
			return;
		} else if (file) {
			globalState.setUploadedFile(file);
			setIsLoading(true);
			const rawJson = await file!.text();

			const folderName =
				globalState.currentSettings.customFolderName.trim().length > 0
					? globalState.currentSettings.customFolderName
					: file.name.split(".")[0];

			let convertedLevel: convertedLevel | undefined;

			try {
				convertedLevel = convertToUEFN(processJSON(rawJson), folderName);
				if (convertedLevel.fileContent.length > 4718592) {
					setLastConvertedMap(convertedLevel);
					globalState.openPopUp({
						title: "Warning!",
						content:
							"Converted Level is bigger than 10MB! If the map doesnt show up please refresh the page",
						type: PopUpTypes.WARNING,
					});
				} else {
					globalState.setLastConvertedFile(convertedLevel);
				}
				globalState.incrementConvertedFiles();
				setIsLoading(false);
			} catch (error: any) {
				console.error(error);
				setErrorOpen(true);
				setErrorTitle("An Error has occured!");
				setErrorStack(error.stack);
				setIsLoading(false);
			}
		}
	}

	function handleCopyClipboard() {
		if (globalState.lastConvertedFile) {
			navigator.clipboard.writeText(globalState.lastConvertedFile.fileContent);
			setTextCopied(true);
			setTimeout(() => setTextCopied(false), 3000);
		} else if (lastConvertedMap) {
			navigator.clipboard.writeText(lastConvertedMap.fileContent);
			setTextCopied(true);
			setTimeout(() => setTextCopied(false), 3000);
		}
	}

	function handleDownload() {
		if (globalState.lastConvertedFile) {
			const blob = new Blob([globalState.lastConvertedFile.fileContent], {
				type: "text/plain",
			});
			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;
			a.download = `${globalState.lastConvertedFile.fileName}.txt`;
			document.body.appendChild(a);
			a.click();

			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} else if (lastConvertedMap) {
			const blob = new Blob([lastConvertedMap.fileContent], {
				type: "text/plain",
			});
			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;
			a.download = `${lastConvertedMap.fileName}.txt`;
			document.body.appendChild(a);
			a.click();

			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}
	}

	return (
		<>
			<div style={{ minHeight: "2.85714286em" }}></div>
			<Container>
				<Row>
					<Column size={6}>
						<Segment
							raised
							padded="very"
							inverted={globalState.currentSettings.darkMode}
						>
							<Header size="huge">UMAP to UEFN converter</Header>
						</Segment>
					</Column>
				</Row>
				<Row>
					<Column size={4}>
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<div style={{ height: "7.5rem" }}>
								<Header size="huge" inverted={globalState.currentSettings.darkMode}>
									You have converted a total of {globalState.totalFilesConverted}{" "}
									file
									{globalState.totalFilesConverted !== 1 ? "s" : ""}!
								</Header>
							</div>
						</Segment>
					</Column>
					<Column size={2}>
						<Segment raised inverted={globalState.currentSettings.darkMode}>
							<div style={{ height: "7.5rem" }}>
								<Header size="tiny" inverted={globalState.currentSettings.darkMode}>
									Created By:{" "}
									<a
										href="https://www.youtube.com/channel/UCbM-2vwIRZHfOxhVNU75bCQ"
										target="_blank"
										rel="noopener noreferrer"
									>
										Sensei Usagi
									</a>
								</Header>
								<Header size="tiny" inverted={globalState.currentSettings.darkMode}>
									Workflow By:{" "}
									<a
										href="https://itsnik.de/"
										target="_blank"
										rel="noopener noreferrer"
									>
										ItsNik &#128011;
									</a>
								</Header>
								<Header
									size="tiny"
									floated="right"
									inverted={globalState.currentSettings.darkMode}
								>
									{/* Ver. FullVersion.FeatureVersion.PatchVersion */}
									Ver. 1.0.1
								</Header>
								<Header size="tiny" inverted={globalState.currentSettings.darkMode}>
									Inspired by:{" "}
									<a
										href="https://www.patreon.com/user/membership?u=70550621"
										target="_blank"
										rel="noopener noreferrer"
									>
										JMAP
									</a>
								</Header>
								<Header size="tiny" inverted={globalState.currentSettings.darkMode}>
									<a
										href="https://github.com/SenseiUsagi/umap-to-uefn-converter/blob/main/LICENSE"
										target="_blank"
										rel="noopener noreferrer"
									>
										License
									</a>
								</Header>
							</div>
						</Segment>
					</Column>
				</Row>
				<Row>
					<Column size={6}>
						<Segment raised color="red" textAlign="center" inverted>
							<Header icon size="large">
								<Icon name="warning" />
								DISCLAIMER
							</Header>
							<Header>
								Porting UMAPS like this is not 100% accurate. Converted Maps might
								not have correct materials, textures or missing models, because they
								either got removed, relocated or replaced! UMAPS converted with this
								tool will also most likely not validate, since they use assets from
								the game itself. You will need to do manual cleanup if you want to
								use converted maps in your project.
							</Header>
						</Segment>
					</Column>
				</Row>
				<Row>
					<Column size={6}>
						<div
							onDragEnter={handleDragEnter}
							onDragLeave={handleDragLeave}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
						>
							<Segment
								inverted
								color={
									dragging
										? "blue"
										: globalState.currentSettings.darkMode
										? "grey"
										: "black"
								}
								id="dragDiv"
								loading={isLoading}
							>
								<Segment
									placeholder
									raised
									textAlign="center"
									inverted={globalState.currentSettings.darkMode}
								>
									<Header icon>
										<Icon name="file code outline" />
										{file ? `Uploaded file: ${file.name}` : "No file uploaded"}
									</Header>
									<label>
										<input
											ref={fileRef}
											type="file"
											style={{ display: "none" }}
											accept=".json"
											onChange={handleChange}
										/>
										<span className="ui primary button">
											{file ? "Change file" : "Upload .json file"}
										</span>
									</label>
								</Segment>
							</Segment>
						</div>
					</Column>
				</Row>
				<Row>
					<Column size={2}>
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<Button
								primary
								disabled={
									typeof globalState.lastConvertedFile === "undefined" &&
									lastConvertedMap === null
								}
								onClick={handleCopyClipboard}
								loading={isLoading}
								size="big"
								icon
								labelPosition="right"
								fluid
							>
								{textCopied ? "Copied!" : "Copy to clipboard"}
								<Icon name="copy" />
							</Button>
						</Segment>
					</Column>
					<Column size={2}>
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<Button
								primary
								disabled={!file}
								onClick={handleConvertion}
								loading={isLoading}
								size="big"
								icon
								labelPosition="right"
								fluid
							>
								Convert to UEFN format
								<Icon name="code" />
							</Button>
						</Segment>
					</Column>
					<Column size={2}>
						<Segment
							raised
							textAlign="center"
							inverted={globalState.currentSettings.darkMode}
						>
							<Button
								primary
								disabled={
									typeof globalState.lastConvertedFile === "undefined" &&
									lastConvertedMap === null
								}
								onClick={handleDownload}
								loading={isLoading}
								size="big"
								icon
								labelPosition="right"
								fluid
							>
								Download .txt file
								<Icon name="download" />
							</Button>
						</Segment>
					</Column>
				</Row>
				<Row>
					<Column size={6}>
						<Segment raised inverted={globalState.currentSettings.darkMode}>
							<Form>
								<TextArea
									readOnly
									placeholder="Copy the resulting text into UEFN"
									value={
										globalState.lastConvertedFile !== undefined
											? globalState.lastConvertedFile.fileContent
											: lastConvertedMap?.fileContent
									}
									rows={25}
									ref={textRef}
								/>
							</Form>
						</Segment>
					</Column>
				</Row>
			</Container>
			<ErrorModal
				open={errorOpen}
				title={errorTitle}
				stackTrace={errorStack}
				onClose={() => {
					setErrorOpen(false);
					setErrorTitle("");
					setErrorStack("");
				}}
			/>
		</>
	);
}

export default ConverterPage;
