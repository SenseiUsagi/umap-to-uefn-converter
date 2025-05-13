// Required
import React, { useRef, useState } from "react";
import { Button, Modal, Header, Icon, Segment } from "semantic-ui-react";
import { PopUpTypes, voidFunction } from "../constants";
import GlobalStore, { GlobalState } from "../state/globalstate";

// General Error modal use in various places
// (consider using the pop up intead of this)
function MoreWorldModal() {
    const fileRef = useRef(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [worldFilePath, setWorldFilePath] = useState<string>("");
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File>();
    const globalState: GlobalState = {
        ...GlobalStore((state) => state),
    };

    window.showAdditionalWorldModel = (filePath: string) => {
        setWorldFilePath(filePath);
        setIsOpen(true);
    };

    function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        setDragging(true);
    }

    function handleDragLeave(event: any) {
        event.preventDefault();
        event.stopPropagation();

        if (event.target.id === "dragDivModal") {
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

    async function handleSubmit() {
        setIsOpen(false);
        if (file) {
            window.resolveUserInput?.(file);
            setFile(undefined);
        }
    }

    return (
        <Modal
            // Clicking the background doesnt close the modal
            closeOnDimmerClick={false}
            // Same with pressing the ESC button
            closeOnEscape={false}
            open={isOpen}
        >
            <Header size="huge">Additional World detected</Header>
            <Modal.Content>
                <Header size="large" textAlign="center">
                    An additional level has been detected. Please provide a json
                    file for this level (if none is provided the level will be
                    skipped)
                </Header>
                <Header size="medium" textAlign="center">
                    {worldFilePath}
                </Header>

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
                        id="dragDivModal"
                    >
                        <Segment
                            placeholder
                            raised
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                        >
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
                                    {file ? "Change file" : "Upload .json file"}
                                </span>
                            </label>
                        </Segment>
                    </Segment>
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={handleSubmit} secondary>
                    Close
                </Button>
                <Button onClick={handleSubmit} secondary>
                    Submit
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default MoreWorldModal;
