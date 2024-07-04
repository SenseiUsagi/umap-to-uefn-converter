import React from "react";
import { Header, Image, Segment } from "semantic-ui-react";
import { Column, Container, Row } from "../components/gridsystem";

function HelpPage() {
    return (
        <>
            <div style={{ minHeight: "2.85714286em" }}></div>
            <Container>
                <Row>
                    <Column size={6}>
                        <Segment raised padded="very" textAlign="center">
                            <Header size="huge">Help / Q&A</Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised padded="very" textAlign="center">
                            <Header size="large">
                                What does this converter do?
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised textAlign="center">
                            <Header size="medium">
                                This converter takes .umap files (pre converted
                                to .json) and converts it into something you can
                                copy paste into UEFN.
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised padded="very" textAlign="center">
                            <Header size="large">
                                Where do I get .json versions of .umap files?
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised textAlign="center">
                            <Header size="medium">
                                You use a Programm called{" "}
                                <a
                                    href="https://fmodel.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    FModel.
                                </a>{" "}
                                It lets you browse through the games files (not
                                limited to Fortnite), export textures, models
                                and .json versions of certain files (like .umap)
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised padded="very" textAlign="center">
                            <Header size="large">
                                My converted level doesnt have roads and paths
                                painted
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        {/* TODO: Make a tutorial and figure out how to compile shit in C# */}
                        <Segment raised textAlign="center">
                            <Header size="medium">
                                Your FModel doesnt export Vertex-Color-Data. I
                                have a tutorial on how you can modify FModel to
                                export that data <a>here</a>, or you use an
                                already modified version <a>here</a>. <br />{" "}
                                (Note when using the already modified one, it
                                will be outdated. Also dont update it if it asks
                                you to update it)
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised padded="very" textAlign="center">
                            <Header size="large">
                                I used a converted map in my project and now it
                                doesnt validate
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised textAlign="center">
                            <Header size="medium">
                                Dont make me tab the sign.
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised padded="very" textAlign="center">
                            <Header size="large">
                                I found a bug or I want to provide feedback
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised textAlign="center">
                            <Header size="medium">
                                For bugs and feedback create an issue on{" "}
                                <a
                                    href="https://github.com/SenseiUsagi/umap-to-uefn-converter/issues"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Github
                                </a>{" "}
                                with their respective labels (bug &
                                enhancement).
                            </Header>
                        </Segment>
                    </Column>
                </Row>
            </Container>
        </>
    );
}

export default HelpPage;
