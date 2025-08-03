import { useRouteError } from "react-router-dom";
import { Column, Container, Row } from "../components/gridsystem";
import { Header, Segment } from "semantic-ui-react";
import NavigationBar from "../components/navigationBar";
import GlobalStore, { GlobalState } from "../state/globalstate";
import { useEffect } from "react";
import { linkReferences } from "../constants";

export default function ErrorPage() {
    const globalState: GlobalState = {
        ...GlobalStore((state) => state),
    };
    const error: any = useRouteError();
    console.error(error);

    useEffect(() => {
        document.body.style.backgroundColor = globalState.currentSettings
            .darkMode
            ? "black"
            : "white";
    }, [globalState.currentSettings.darkMode]);

    return (
        <>
            <NavigationBar />
            <div style={{ minHeight: "2.85714286em" }}></div>
            <Container>
                <Row>
                    <Column size={6}>
                        <Segment color="red" raised textAlign="center" inverted>
                            <Header size="large">An Error has occured!</Header>
                        </Segment>
                    </Column>
                </Row>
                {error.status !== 404 && (
                    <Row>
                        <Column size={6}>
                            <Segment
                                raised
                                textAlign="center"
                                inverted={globalState.currentSettings.darkMode}
                            >
                                <Header size="medium">
                                    Please do a screenshot of this page an
                                    create an issue on{" "}
                                    <a
                                        href={linkReferences.githubIssues}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Github.
                                    </a>{" "}
                                    <br />
                                    Please also provide details on how you got
                                    the error
                                </Header>
                            </Segment>
                        </Column>
                    </Row>
                )}
                <Row>
                    <Column size={6}>
                        <Segment
                            raised
                            inverted={globalState.currentSettings.darkMode}
                        >
                            <Header size="medium">
                                {error.statusText || error.message}
                            </Header>
                        </Segment>
                    </Column>
                </Row>
            </Container>
        </>
    );
}
