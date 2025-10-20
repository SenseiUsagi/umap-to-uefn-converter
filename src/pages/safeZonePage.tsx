import { useRef, useState } from "react";
import { handleCopyClipboard, SafeZoneKeyFrame } from "../constants";
import { Column, Container, Row } from "../components/gridsystem";
import {
    Button,
    Divider,
    Form,
    Header,
    Icon,
    Input,
    Segment,
    SegmentGroup,
    TextArea,
} from "semantic-ui-react";
import GlobalStore, { GlobalState } from "../state/globalstate";
import { generateSequence } from "../storm_sequencer";

function SafeZonePage() {
    const globalState: GlobalState = {
        ...GlobalStore((state) => state),
    };
    const textRef = useRef(null);
    const [textCopied, setTextCopied] = useState(false);
    const [formDelay, setFormDelay] = useState<number>(60);
    const [initialRadius, setInitialRadius] = useState<number>(200);
    const [initialPosX, setInitialPosX] = useState<number>(0);
    const [initialPosY, setInitialPosY] = useState<number>(0);
    const [lastSequence, setLastSequence] = useState<string | null>(null);
    const [stormKeyFrames, setStormKeyFrames] = useState<SafeZoneKeyFrame[]>(
        []
    );

    // Delay time + wait time + resize time

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
                            <Header size="huge">Safe Zone Sequencer</Header>
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
                            <Header size="large">How to use:</Header>
                            <Header>
                                Place an Advanced Storm Controller somewhere in
                                your map (make sure "Use Custom Storm Phases" is
                                set to true), then place Advanced Storm
                                Controller Beacons in your map and adjust their
                                settings. Afterwards add as many key frames here
                                as you have placed Beacons and fill in their
                                data. Click generate, copy the output and paste
                                it into a sequencer that contains the
                                SafeZoneClouds Material Parameter Collection
                                from my Ported Assets. Make sure it contains:
                                SafeZoneLoc, CloudStartingBias, SafeZoneScale.
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
                            <Header size="large">Key Frames:</Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={1.5}>
                        <Segment
                            raised
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                            padded
                        >
                            <Header size="medium">
                                Initial Form Delay (in seconds)
                            </Header>
                            <Input
                                type="number"
                                value={formDelay}
                                onChange={(event) => {
                                    setFormDelay(
                                        event.target.value.trim().length !== 0
                                            ? Number.parseFloat(
                                                  event.target.value
                                              )
                                            : 0
                                    );
                                }}
                            ></Input>
                        </Segment>
                    </Column>
                    <Column size={1.5}>
                        <Segment
                            raised
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                            padded
                        >
                            <Header size="medium">
                                Initial Radius (in Meters)
                            </Header>
                            <Input
                                type="number"
                                value={initialRadius}
                                onChange={(event) => {
                                    setInitialRadius(
                                        event.target.value.trim().length !== 0
                                            ? Number.parseFloat(
                                                  event.target.value
                                              )
                                            : 0
                                    );
                                }}
                            ></Input>
                        </Segment>
                    </Column>
                    <Column size={1.5}>
                        <Segment
                            raised
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                            padded
                        >
                            <Header size="medium">Initial X Position</Header>
                            <Input
                                type="number"
                                value={initialPosX}
                                onChange={(event) => {
                                    setInitialPosX(
                                        event.target.value.trim().length !== 0
                                            ? Number.parseFloat(
                                                  event.target.value
                                              )
                                            : 0
                                    );
                                }}
                            ></Input>
                        </Segment>
                    </Column>
                    <Column size={1.5}>
                        <Segment
                            raised
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                            padded
                        >
                            <Header size="medium">Initial Y Position</Header>
                            <Input
                                type="number"
                                value={initialPosY}
                                onChange={(event) => {
                                    setInitialPosY(
                                        event.target.value.trim().length !== 0
                                            ? Number.parseFloat(
                                                  event.target.value
                                              )
                                            : 0
                                    );
                                }}
                            ></Input>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment
                            raised
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                            padded="very"
                        >
                            <Button
                                primary
                                disabled={stormKeyFrames.length === 50}
                                onClick={() => {
                                    const copyFrames = [...stormKeyFrames];
                                    copyFrames.push({
                                        radius: 0,
                                        resizeTime: 0,
                                        waitTime: 0,
                                        PosX: 0,
                                        PosY: 0,
                                    });
                                    setStormKeyFrames(copyFrames);
                                }}
                                size="big"
                                icon
                                labelPosition="right"
                                fluid
                            >
                                Add Phase
                                <Icon name="code" />
                            </Button>
                        </Segment>
                    </Column>
                </Row>
                <Divider />
                {stormKeyFrames.map((element, index) => {
                    return (
                        <>
                            <Row>
                                <Column size={6}>
                                    <Segment
                                        textAlign="center"
                                        inverted={
                                            globalState.currentSettings.darkMode
                                        }
                                    >
                                        <Header size="large">{`Storm Phase ${
                                            index + 1
                                        }`}</Header>
                                    </Segment>
                                </Column>
                                <Column size={3}>
                                    <Segment
                                        raised
                                        inverted={
                                            globalState.currentSettings.darkMode
                                        }
                                        textAlign="center"
                                    >
                                        <Header size="medium">
                                            X Position
                                        </Header>
                                        <Input
                                            type="number"
                                            value={element.PosX}
                                            onChange={(event) => {
                                                const copyFrames = [
                                                    ...stormKeyFrames,
                                                ];
                                                copyFrames[index] = {
                                                    ...copyFrames[index],
                                                    PosX:
                                                        event.target.value.trim()
                                                            .length !== 0
                                                            ? Number.parseFloat(
                                                                  event.target
                                                                      .value
                                                              )
                                                            : 0,
                                                };
                                                setStormKeyFrames(copyFrames);
                                            }}
                                        ></Input>
                                    </Segment>
                                </Column>
                                <Column size={3}>
                                    <Segment
                                        raised
                                        inverted={
                                            globalState.currentSettings.darkMode
                                        }
                                        textAlign="center"
                                    >
                                        <Header size="medium">
                                            Y Position
                                        </Header>
                                        <Input
                                            type="number"
                                            value={element.PosY}
                                            onChange={(event) => {
                                                const copyFrames = [
                                                    ...stormKeyFrames,
                                                ];
                                                copyFrames[index] = {
                                                    ...copyFrames[index],
                                                    PosY:
                                                        event.target.value.trim()
                                                            .length !== 0
                                                            ? Number.parseFloat(
                                                                  event.target
                                                                      .value
                                                              )
                                                            : 0,
                                                };
                                                setStormKeyFrames(copyFrames);
                                            }}
                                        ></Input>
                                    </Segment>
                                </Column>
                                <Column size={2}>
                                    <Segment
                                        raised
                                        inverted={
                                            globalState.currentSettings.darkMode
                                        }
                                        textAlign="center"
                                    >
                                        <Header size="medium">
                                            Radius (in Meters)
                                        </Header>
                                        <Input
                                            type="number"
                                            value={element.radius}
                                            onChange={(event) => {
                                                const copyFrames = [
                                                    ...stormKeyFrames,
                                                ];
                                                copyFrames[index] = {
                                                    ...copyFrames[index],
                                                    radius:
                                                        event.target.value.trim()
                                                            .length !== 0
                                                            ? Number.parseFloat(
                                                                  event.target
                                                                      .value
                                                              )
                                                            : 0,
                                                };
                                                setStormKeyFrames(copyFrames);
                                            }}
                                        ></Input>
                                    </Segment>
                                </Column>
                                <Column size={2}>
                                    <Segment
                                        raised
                                        inverted={
                                            globalState.currentSettings.darkMode
                                        }
                                        textAlign="center"
                                    >
                                        <Header size="medium">
                                            Wait Time (in Seconds)
                                        </Header>
                                        <Input
                                            type="number"
                                            value={element.waitTime}
                                            onChange={(event) => {
                                                const copyFrames = [
                                                    ...stormKeyFrames,
                                                ];
                                                copyFrames[index] = {
                                                    ...copyFrames[index],
                                                    waitTime:
                                                        event.target.value.trim()
                                                            .length !== 0
                                                            ? Number.parseFloat(
                                                                  event.target
                                                                      .value
                                                              )
                                                            : 0,
                                                };
                                                setStormKeyFrames(copyFrames);
                                            }}
                                        ></Input>
                                    </Segment>
                                </Column>
                                <Column size={2}>
                                    <Segment
                                        raised
                                        inverted={
                                            globalState.currentSettings.darkMode
                                        }
                                        textAlign="center"
                                    >
                                        <Header size="medium">
                                            Resize Time (in Seconds)
                                        </Header>
                                        <Input
                                            type="number"
                                            value={element.resizeTime}
                                            onChange={(event) => {
                                                const copyFrames = [
                                                    ...stormKeyFrames,
                                                ];
                                                copyFrames[index] = {
                                                    ...copyFrames[index],
                                                    resizeTime:
                                                        event.target.value.trim()
                                                            .length !== 0
                                                            ? Number.parseFloat(
                                                                  event.target
                                                                      .value
                                                              )
                                                            : 0,
                                                };
                                                setStormKeyFrames(copyFrames);
                                            }}
                                        ></Input>
                                    </Segment>
                                </Column>
                            </Row>
                            <Divider />
                        </>
                    );
                })}
                <Row>
                    <Column size={2}>
                        <Segment
                            raised
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Button
                                primary
                                disabled={lastSequence === null}
                                onClick={() => {
                                    if (lastSequence !== null) {
                                        handleCopyClipboard(
                                            lastSequence,
                                            setTextCopied
                                        );
                                    }
                                }}
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
                                disabled={stormKeyFrames.length === 0}
                                onClick={() => {
                                    console.log("started generating sequence");
                                    try {
                                        const generatedSequence =
                                            generateSequence(
                                                stormKeyFrames,
                                                formDelay,
                                                initialRadius,
                                                initialPosX,
                                                initialPosY
                                            );
                                        setLastSequence(generatedSequence);
                                    } catch (error) {}
                                }}
                                size="big"
                                icon
                                labelPosition="right"
                                fluid
                            >
                                Generate Sequence
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
                                disabled={lastSequence === null}
                                onClick={() => {
                                    const blob = new Blob([lastSequence!], {
                                        type: "text/plain",
                                    });
                                    const url = URL.createObjectURL(blob);

                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = `StormSequence.txt`;
                                    document.body.appendChild(a);
                                    a.click();

                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                }}
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
                        <Segment
                            raised
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Form>
                                <TextArea
                                    readOnly
                                    placeholder="Copy the resulting text into your level sequence"
                                    value={
                                        lastSequence !== null
                                            ? lastSequence
                                            : ""
                                    }
                                    rows={25}
                                    ref={textRef}
                                />
                            </Form>
                        </Segment>
                    </Column>
                </Row>
            </Container>
        </>
    );
}

export default SafeZonePage;
