import React, { useState } from "react";
import { Button, Checkbox, Header, Input, Segment } from "semantic-ui-react";
import GlobalStore, { GlobalState } from "../state/globalstate";
import { Column, Container, Row } from "../components/gridsystem";
import { linkReferences } from "../constants";

function SettingsPage() {
    const globalState: GlobalState = {
        ...GlobalStore((state) => state),
    };

    const [projectName, setProjectName] = useState(
        globalState.currentSettings.portedModelsProjectName
    );
    const [folderName, setFolderName] = useState(
        globalState.currentSettings.customFolderName
    );

    function changeBiome(biomeName: string) {
        const newBiomeSettings = {
            ...globalState.currentSettings.overrideBiome,
        };

        for (let key in newBiomeSettings) {
            if (Object.prototype.hasOwnProperty.call(newBiomeSettings, key)) {
                if (
                    newBiomeSettings[
                        key as keyof typeof globalState.currentSettings.overrideBiome
                    ] === true
                ) {
                    if (key !== "forceCave" && key !== biomeName) {
                        newBiomeSettings[
                            key as keyof typeof globalState.currentSettings.overrideBiome
                        ] = false;
                    }
                }
            }
        }

        newBiomeSettings[
            biomeName as keyof typeof globalState.currentSettings.overrideBiome
        ] =
            !globalState.currentSettings.overrideBiome[
                biomeName as keyof typeof globalState.currentSettings.overrideBiome
            ];

        globalState.changeSettings({
            ...globalState.currentSettings,
            overrideBiome: newBiomeSettings,
        });
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
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header size="huge">Settings</Header>
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
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                    size="large"
                                >
                                    Darkmode
                                </Header>
                                <Checkbox
                                    toggle
                                    onChange={() => {
                                        globalState.changeSettings({
                                            ...globalState.currentSettings,
                                            darkMode:
                                                !globalState.currentSettings
                                                    .darkMode,
                                        });
                                    }}
                                    checked={
                                        globalState.currentSettings.darkMode
                                    }
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
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                >
                                    Convert only terrain
                                </Header>
                                <Header
                                    size="small"
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                >
                                    Only convert the terrain of a json file
                                </Header>
                                <Checkbox
                                    toggle
                                    onChange={() => {
                                        globalState.changeSettings({
                                            ...globalState.currentSettings,
                                            exportOnlyTerrain:
                                                !globalState.currentSettings
                                                    .exportOnlyTerrain,
                                            exportNoTerrain: globalState
                                                .currentSettings.exportNoTerrain
                                                ? false
                                                : globalState.currentSettings
                                                      .exportNoTerrain,
                                        });
                                    }}
                                    checked={
                                        globalState.currentSettings
                                            .exportOnlyTerrain
                                    }
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
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                >
                                    Convert only buildings
                                </Header>
                                <Header
                                    size="small"
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                >
                                    Only convert the buildings of a json file
                                </Header>
                                <Checkbox
                                    toggle
                                    onChange={() => {
                                        globalState.changeSettings({
                                            ...globalState.currentSettings,
                                            exportNoTerrain:
                                                !globalState.currentSettings
                                                    .exportNoTerrain,
                                            exportOnlyTerrain: globalState
                                                .currentSettings
                                                .exportOnlyTerrain
                                                ? false
                                                : globalState.currentSettings
                                                      .exportOnlyTerrain,
                                        });
                                    }}
                                    checked={
                                        globalState.currentSettings
                                            .exportNoTerrain
                                    }
                                />
                            </div>
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
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                >
                                    Try to autofix broken texture data
                                </Header>
                                <Header
                                    size="small"
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                >
                                    Over the time the path for texture data has
                                    changed. This setting will try to
                                    automatically fix the path for the newest
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
                                    checked={
                                        globalState.currentSettings
                                            .tryToAutoFixTextureData
                                    }
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
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                >
                                    Propagate Levels inside Levels
                                </Header>
                                <Header
                                    size="small"
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                >
                                    If an additional world is found inside the
                                    current one, ask for that worlds JSON file
                                    so it can be converted as well
                                </Header>
                                <Header
                                    size="small"
                                    color="red"
                                    inverted={true}
                                >
                                    WARNING! USE AT YOUR OWN RISK! POTENTIAL
                                    CRASH DUE TO OUT OF MEMORY POSSIBLE
                                </Header>
                                <Checkbox
                                    toggle
                                    onChange={() => {
                                        globalState.changeSettings({
                                            ...globalState.currentSettings,
                                            propagateLevels:
                                                !globalState.currentSettings
                                                    .propagateLevels,
                                        });
                                    }}
                                    checked={
                                        globalState.currentSettings
                                            .propagateLevels
                                    }
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
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                >
                                    Custom Folder name
                                </Header>
                                <Header
                                    size="small"
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                >
                                    The converted actors are automatically
                                    placed inside a folder (usually the file
                                    name of the json). Here you can provide a
                                    custom folder name.
                                </Header>
                                <Input
                                    inverted={
                                        globalState.currentSettings.darkMode
                                    }
                                    placeholder="Folder Name"
                                    value={folderName}
                                    onChange={(event) => {
                                        setFolderName(event.target.value);
                                    }}
                                    action={
                                        <Button
                                            primary
                                            onClick={() => {
                                                globalState.changeSettings({
                                                    ...globalState.currentSettings,
                                                    customFolderName:
                                                        folderName,
                                                });
                                            }}
                                        >
                                            Apply
                                        </Button>
                                    }
                                />
                            </div>
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
                                Use recreated terrain instead of the one from
                                the game
                            </Header>
                            <Header size="medium">
                                This option tries to use the terrain models I
                                have ported to UEFN instead of the ones from the
                                game. This makes validating a ported map a
                                little bit easier. You can find the recreated
                                terrain{" "}
                                <a
                                    href={linkReferences.collectionDownload}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    here
                                </a>{" "}
                                (only compatable with V3.1 of my ported models).
                            </Header>
                            <Checkbox
                                toggle
                                onChange={() => {
                                    globalState.changeSettings({
                                        ...globalState.currentSettings,
                                        usePortedModels:
                                            !globalState.currentSettings
                                                .usePortedModels,
                                    });
                                }}
                                checked={
                                    globalState.currentSettings.usePortedModels
                                }
                            />
                            <Header size="medium">
                                Your project name will be required for the
                                ported models to actually get imported into you
                                level (Empty = "Game")
                            </Header>
                            <Header size="medium" color="red">
                                BROKEN MESH PAINT ON THE MESHES IS TO BE
                                EXPECTED!!!
                            </Header>
                            <Input
                                inverted={globalState.currentSettings.darkMode}
                                disabled={
                                    !globalState.currentSettings.usePortedModels
                                }
                                placeholder="Project Name"
                                size="huge"
                                value={projectName}
                                onChange={(event) => {
                                    setProjectName(event.target.value);
                                }}
                                action={
                                    <Button
                                        primary
                                        onClick={() => {
                                            if (
                                                projectName.trim().length === 0
                                            ) {
                                                setProjectName("Game");
                                            }
                                            globalState.changeSettings({
                                                ...globalState.currentSettings,
                                                portedModelsProjectName:
                                                    projectName.trim().length >
                                                    0
                                                        ? projectName
                                                        : "Game",
                                            });
                                        }}
                                    >
                                        Apply
                                    </Button>
                                }
                            />
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
                                Override Biome detection (when using ported
                                assets)
                            </Header>
                            <Header size="medium">
                                Instead of trying to auto detect what biome to
                                use, specify a specific Biome
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={1.5}>
                        <Segment
                            raised
                            padded="very"
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header
                                size="medium"
                                inverted={globalState.currentSettings.darkMode}
                            >
                                Grass Biome
                            </Header>
                            <Checkbox
                                toggle
                                disabled={
                                    !globalState.currentSettings.usePortedModels
                                }
                                onChange={changeBiome.bind(null, "grasBiome")}
                                checked={
                                    globalState.currentSettings.overrideBiome
                                        .grasBiome
                                }
                            />
                        </Segment>
                    </Column>
                    <Column size={1.5}>
                        <Segment
                            raised
                            padded="very"
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header
                                size="medium"
                                inverted={globalState.currentSettings.darkMode}
                            >
                                Mountain Biome
                            </Header>
                            <Checkbox
                                toggle
                                disabled={
                                    !globalState.currentSettings.usePortedModels
                                }
                                onChange={changeBiome.bind(
                                    null,
                                    "mountainBiome"
                                )}
                                checked={
                                    globalState.currentSettings.overrideBiome
                                        .mountainBiome
                                }
                            />
                        </Segment>
                    </Column>
                    <Column size={1.5}>
                        <Segment
                            raised
                            padded="very"
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header
                                size="medium"
                                inverted={globalState.currentSettings.darkMode}
                            >
                                Farm Biome
                            </Header>
                            <Checkbox
                                toggle
                                disabled={
                                    !globalState.currentSettings.usePortedModels
                                }
                                onChange={changeBiome.bind(null, "farmBiome")}
                                checked={
                                    globalState.currentSettings.overrideBiome
                                        .farmBiome
                                }
                            />
                        </Segment>
                    </Column>
                    <Column size={1.5}>
                        <Segment
                            raised
                            padded="very"
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header
                                size="medium"
                                inverted={globalState.currentSettings.darkMode}
                            >
                                Swamp Biome
                            </Header>
                            <Checkbox
                                toggle
                                disabled={
                                    !globalState.currentSettings.usePortedModels
                                }
                                onChange={changeBiome.bind(null, "swampBiome")}
                                checked={
                                    globalState.currentSettings.overrideBiome
                                        .swampBiome
                                }
                            />
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={1.5}>
                        <Segment
                            raised
                            padded="very"
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header
                                size="medium"
                                inverted={globalState.currentSettings.darkMode}
                            >
                                Snow Biome
                            </Header>
                            <Checkbox
                                toggle
                                disabled={
                                    !globalState.currentSettings.usePortedModels
                                }
                                onChange={changeBiome.bind(null, "snowBiome")}
                                checked={
                                    globalState.currentSettings.overrideBiome
                                        .snowBiome
                                }
                            />
                        </Segment>
                    </Column>
                    <Column size={1.5}>
                        <Segment
                            raised
                            padded="very"
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header
                                size="medium"
                                inverted={globalState.currentSettings.darkMode}
                            >
                                Junlge Biome
                            </Header>
                            <Checkbox
                                toggle
                                disabled={
                                    !globalState.currentSettings.usePortedModels
                                }
                                onChange={changeBiome.bind(null, "jungleBiome")}
                                checked={
                                    globalState.currentSettings.overrideBiome
                                        .jungleBiome
                                }
                            />
                        </Segment>
                    </Column>
                    <Column size={1.5}>
                        <Segment
                            raised
                            padded="very"
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header
                                size="medium"
                                inverted={globalState.currentSettings.darkMode}
                            >
                                AD (Plankerton) Biome
                            </Header>
                            <Checkbox
                                toggle
                                disabled={
                                    !globalState.currentSettings.usePortedModels
                                }
                                onChange={changeBiome.bind(null, "adBiome")}
                                checked={
                                    globalState.currentSettings.overrideBiome
                                        .adBiome
                                }
                            />
                        </Segment>
                    </Column>
                    <Column size={1.5}>
                        <Segment
                            raised
                            padded="very"
                            textAlign="center"
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header
                                size="medium"
                                inverted={globalState.currentSettings.darkMode}
                            >
                                Force Cave Floor
                            </Header>
                            <Checkbox
                                toggle
                                disabled={
                                    !globalState.currentSettings.usePortedModels
                                }
                                onChange={() => {
                                    globalState.changeSettings({
                                        ...globalState.currentSettings,
                                        overrideBiome: {
                                            ...globalState.currentSettings
                                                .overrideBiome,
                                            forceCave:
                                                !globalState.currentSettings
                                                    .overrideBiome.forceCave,
                                        },
                                    });
                                }}
                                checked={
                                    globalState.currentSettings.overrideBiome
                                        .forceCave
                                }
                            />
                        </Segment>
                    </Column>
                </Row>
            </Container>
        </>
    );
}

export default SettingsPage;
