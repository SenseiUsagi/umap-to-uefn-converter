import React, { useRef, useState } from "react";
import {
    Button,
    Form,
    Header,
    Icon,
    Segment,
    TextArea,
} from "semantic-ui-react";
import { Column, Container, Row } from "../gridsystem";
import { convertToUEFN } from "../../converter";
import { processJSON } from "../../constants";
import GlobalStore, { GlobalState } from "../../state/globalstate";

function ConverterPage() {
    const [file, setFile] = useState<File>();

    const [dragging, setDragging] = useState(false);

    const fileRef = useRef(null);
    const textRef = useRef(null);

    const [textCopied, setTextCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const globalState: GlobalState = {
        ...GlobalStore((state) => state),
    };

    function handleDragEnter(event: any) {
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

    function handleDragOver(event: any) {
        event.preventDefault();
        event.stopPropagation();
    }

    function handleDrop(event: any) {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            setFile(event.dataTransfer.files[0]);
            event.dataTransfer.clearData();
        }
    }

    function handleChange(event: any) {
        event.stopPropagation();
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
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

            const convertedLevel = convertToUEFN(
                processJSON(rawJson),
                folderName
            );

            setIsLoading(false);
            globalState.setLastConvertedFile(convertedLevel);
        }
    }

    function handleCopyClipboard() {
        if (globalState.lastConvertedFile) {
            navigator.clipboard.writeText(
                globalState.lastConvertedFile.fileContent
            );
            setTextCopied(true);
            setTimeout(() => setTextCopied(false), 3000);
        }
    }

    return (
        <Container>
            <Row>
                <Column size={6}>
                    <Segment raised padded="very">
                        <Header size="huge">UMAP to UEFN converter</Header>
                    </Segment>
                </Column>
            </Row>
            <Row>
                <Column size={4}></Column>
                <Column size={2}>
                    <Segment raised>
                        <Header size="tiny">
                            Created By:{" "}
                            <a
                                href="https://www.youtube.com/channel/UCbM-2vwIRZHfOxhVNU75bCQ"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Sensei Usagi
                            </a>
                        </Header>
                        <Header size="tiny">
                            Hosted By:{" "}
                            <a
                                href="https://itsnik.de/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ItsNik
                            </a>
                            <a
                                href="https://google.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                &#128011;
                            </a>
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
                            color={dragging ? "blue" : "black"}
                            id="dragDiv"
                            loading={isLoading}
                        >
                            <Segment placeholder raised textAlign="center">
                                <Header icon>
                                    <Icon name="file code outline" />
                                    {file
                                        ? `Uploaded file: ${file.name}`
                                        : "No file uploaded"}
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
                                        {file
                                            ? "Change file"
                                            : "Upload .json file"}
                                    </span>
                                </label>
                            </Segment>
                        </Segment>
                    </div>
                </Column>
            </Row>
            <Row>
                <Column size={6}>
                    <Segment raised padded="very" textAlign="center">
                        <Button
                            disabled={!file}
                            primary
                            onClick={handleConvertion}
                            loading={isLoading}
                        >
                            Convert to UEFN format
                        </Button>
                    </Segment>
                </Column>
            </Row>
            <Row>
                <Column size={3}>
                    <Segment raised>
                        <Button
                            primary
                            fluid
                            disabled={
                                typeof globalState.lastConvertedFile ===
                                "undefined"
                            }
                            onClick={handleCopyClipboard}
                        >
                            Copy to clipboard
                        </Button>
                    </Segment>
                </Column>
                <Column size={3}>
                    <Segment raised>
                        <Button
                            primary
                            fluid
                            disabled={
                                typeof globalState.lastConvertedFile ===
                                "undefined"
                            }
                        >
                            Download .txt file
                        </Button>
                    </Segment>
                </Column>
            </Row>
            <Row>
                <Column size={6}>
                    <Segment raised>
                        <Form>
                            <TextArea
                                readOnly
                                placeholder="Copy the resulting text into UEFN"
                                value={
                                    globalState.lastConvertedFile?.fileContent
                                }
                                rows={25}
                                ref={textRef}
                            />
                        </Form>
                    </Segment>
                </Column>
            </Row>
        </Container>
    );
}

export default ConverterPage;
