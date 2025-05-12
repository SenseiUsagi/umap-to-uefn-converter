// Required
import React from "react";
import { Button, Modal, Header, Icon } from "semantic-ui-react";
import { voidFunction } from "../constants";

// General Error modal use in various places
// (consider using the pop up intead of this)
function ErrorModal({
    open,
    onClose,
    title,
    stackTrace,
}: {
    open: boolean;
    onClose: voidFunction;
    title: String;
    stackTrace: String;
}) {
    return (
        <Modal
            // Clicking the background doesnt close the modal
            closeOnDimmerClick={false}
            // Same with pressing the ESC button
            closeOnEscape={false}
            onClose={onClose}
            open={open}
        >
            {/* Always shows a giant red ! */}
            <Header size="huge" color="red" icon>
                <Icon name="warning" color="red" />
                {/* Should there not be a title defined display a generic 404 */}
                <div>{title}</div>
            </Header>
            <Modal.Content>
                <Header size="large" textAlign="center">
                    The Error:
                </Header>
                <Header size="medium" textAlign="center">
                    {stackTrace}
                </Header>
                <Header size="medium" textAlign="center">
                    Please take a screanshot of this and create an issue on{" "}
                    <a
                        href="https://github.com/SenseiUsagi/umap-to-uefn-converter/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Github
                    </a>{" "}
                    and provider the .json file you were trying to convert.
                    Please also follow the Bug report Template.
                </Header>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={onClose} secondary>
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default ErrorModal;
