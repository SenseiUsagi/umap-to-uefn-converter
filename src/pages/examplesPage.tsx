import React, { useState } from "react";
import { Button, Form, Header, Segment, TextArea } from "semantic-ui-react";
import athenaCity from "../assets/data/Athena_POI_City_001.txt";
import athenaSuburban from "../assets/data/Athena_POI_Suburban_006.txt";
import athenaHouseA from "../assets/data/Athena_SUB_5x5_House_jj.txt";
import athenaHouseB from "../assets/data/Athena_URB_5x5_Apartment_i.txt";
import { Column, Container, Row } from "../components/gridsystem";

function ExamplesPage() {
    const [cityCopied, setCityCopied] = useState<boolean>(false);
    const [suburbanCopied, setSuburbanCopied] = useState<boolean>(false);
    const [houseACopied, setHouseACopied] = useState<boolean>(false);
    const [houseBCopied, setHouseBCopied] = useState<boolean>(false);

    function handleCopyClipboard(
        text: string,
        copyFunction: React.Dispatch<React.SetStateAction<boolean>>
    ) {
        navigator.clipboard.writeText(text);
        copyFunction(true);
        setTimeout(() => copyFunction(false), 3000);
    }

    function handleDownload(fileContent: string, fileName: string) {
        const blob = new Blob([fileContent], {
            type: "text/plain",
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.txt`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function truncateText(text: string): string {
        if (text.length <= 300) {
            return text;
        } else {
            return text.substring(0, 300).trim() + "...";
        }
    }

    return (
        <>
            <div style={{ minHeight: "2.85714286em" }}></div>
            <Container>
                <Row>
                    <Column size={6}>
                        <Segment raised padded textAlign="center">
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
                        <Segment raised padded>
                            <Header floated="left">Tilted Towers</Header>
                            <Form>
                                <Button
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
                                    icon="download"
                                    primary
                                    floated="right"
                                    onClick={handleDownload.bind(
                                        null,
                                        athenaCity,
                                        "Athena_POI_City_001"
                                    )}
                                />
                                <TextArea
                                    readOnly
                                    value={athenaCity}
                                    rows={5}
                                />
                            </Form>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised padded>
                            <Header floated="left">Salty Springs</Header>
                            <Form>
                                <Button
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
                                    icon="download"
                                    primary
                                    floated="right"
                                    onClick={handleDownload.bind(
                                        null,
                                        athenaSuburban,
                                        "Athena_POI_Suburban_006"
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
                        <Segment raised padded>
                            <Header floated="left">House Sub_5x5_JJ</Header>
                            <Form>
                                <Button
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
                                    icon="download"
                                    primary
                                    floated="right"
                                    onClick={handleDownload.bind(
                                        null,
                                        athenaHouseA,
                                        "Athena_SUB_5x5_House_jj"
                                    )}
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
                        <Segment raised padded>
                            <Header floated="left">Some tilted house</Header>
                            <Form>
                                <Button
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
                                    icon="download"
                                    primary
                                    floated="right"
                                    onClick={handleDownload.bind(
                                        null,
                                        athenaHouseB,
                                        "Athena_URB_5x5_Apartment"
                                    )}
                                />
                                <TextArea
                                    readOnly
                                    value={athenaHouseB}
                                    rows={5}
                                />
                            </Form>
                        </Segment>
                    </Column>
                </Row>
            </Container>
        </>
    );
}

export default ExamplesPage;
