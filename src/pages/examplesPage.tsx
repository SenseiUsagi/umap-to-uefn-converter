import React, { useState } from "react";
import {
    Button,
    Form,
    Header,
    Image,
    Segment,
    TextArea,
} from "semantic-ui-react";
import athenaCity from "../assets/data/Athena_POI_City_001.txt";
import athenaSuburban from "../assets/data/Athena_POI_Suburban_006.txt";
import athenaHouseA from "../assets/data/Athena_SUB_5x5_House_jj.txt";
import athenaHouseB from "../assets/data/Athena_URB_5x5_Apartment_i.txt";
import { Column, Container, Row } from "../components/gridsystem";
import GlobalStore, { GlobalState } from "../state/globalstate";
import {
    convertedLevel,
    handleCopyClipboard,
    handleDownload,
} from "../constants";

function ExamplesPage() {
    const globalState: GlobalState = {
        ...GlobalStore((state) => state),
    };
    const [cityCopied, setCityCopied] = useState<boolean>(false);
    const [suburbanCopied, setSuburbanCopied] = useState<boolean>(false);
    const [houseACopied, setHouseACopied] = useState<boolean>(false);
    const [houseBCopied, setHouseBCopied] = useState<boolean>(false);

    const tiltedTowers: convertedLevel = {
        fileName: "Tilted Towers 3.5",
        fileContent: athenaCity,
        dateCreated: new Date(),
    };
    const saltySprings: convertedLevel = {
        fileName: "Salty Springs 3.5",
        fileContent: athenaSuburban,
        dateCreated: new Date(),
    };
    const houseA: convertedLevel = {
        fileName: "House A 3.5",
        fileContent: athenaCity,
        dateCreated: new Date(),
    };
    const houseB: convertedLevel = {
        fileName: "House B 3.5",
        fileContent: athenaCity,
        dateCreated: new Date(),
    };

    return (
        <>
            <div style={{ minHeight: "2.85714286em" }}></div>
            <Container>
                <Row>
                    <Column size={6}>
                        <Segment
                            raised
                            padded
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header size="huge">Examples</Header>
                            <Header size="large">
                                These examples were converted with this very
                                converter
                            </Header>
                            <Header size="small">
                                The .json files were taken from Fortnite Season
                                3.5
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment
                            raised
                            padded
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header floated="left">Tilted Towers</Header>
                            <Form>
                                <Button
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                    icon={cityCopied ? "checkmark" : "copy"}
                                    primary
                                    floated="right"
                                    onClick={handleCopyClipboard.bind(
                                        null,
                                        athenaCity,
                                        setCityCopied
                                    )}
                                />
                                <Button
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                    icon="download"
                                    primary
                                    floated="right"
                                    onClick={handleDownload.bind(
                                        null,
                                        tiltedTowers
                                    )}
                                />
                                <TextArea
                                    readOnly
                                    value={athenaCity}
                                    rows={10}
                                />
                            </Form>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment
                            raised
                            padded
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header floated="left">Salty Springs</Header>
                            <Form>
                                <Button
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                    icon={suburbanCopied ? "checkmark" : "copy"}
                                    primary
                                    floated="right"
                                    onClick={handleCopyClipboard.bind(
                                        null,
                                        athenaSuburban,
                                        setSuburbanCopied
                                    )}
                                />
                                <Button
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                    icon="download"
                                    primary
                                    floated="right"
                                    onClick={handleDownload.bind(
                                        null,
                                        saltySprings
                                    )}
                                />
                                <TextArea
                                    readOnly
                                    value={athenaSuburban}
                                    rows={5}
                                />
                            </Form>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment
                            raised
                            padded
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header floated="left">Snobby House</Header>
                            <Form>
                                <Button
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                    icon={houseACopied ? "checkmark" : "copy"}
                                    primary
                                    floated="right"
                                    onClick={handleCopyClipboard.bind(
                                        null,
                                        athenaHouseA,
                                        setHouseACopied
                                    )}
                                />
                                <Button
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                    icon="download"
                                    primary
                                    floated="right"
                                    onClick={handleDownload.bind(null, houseA)}
                                />
                                <TextArea
                                    readOnly
                                    value={athenaHouseA}
                                    rows={5}
                                />
                            </Form>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment
                            raised
                            padded
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header floated="left">
                                Tilted Towers Apartment
                            </Header>
                            <Form>
                                <Button
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                    icon={houseBCopied ? "checkmark" : "copy"}
                                    primary
                                    floated="right"
                                    onClick={handleCopyClipboard.bind(
                                        null,
                                        athenaHouseB,
                                        setHouseBCopied
                                    )}
                                />
                                <Button
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                    icon="download"
                                    primary
                                    floated="right"
                                    onClick={handleDownload.bind(null, houseB)}
                                />
                                <TextArea
                                    readOnly
                                    value={athenaHouseB}
                                    rows={5}
                                />
                            </Form>
                            <Image />
                        </Segment>
                    </Column>
                </Row>
            </Container>
        </>
    );
}

export default ExamplesPage;
