import { useRouteError } from "react-router-dom";
import { Column, Container, Row } from "../components/gridsystem";
import { Header, Segment } from "semantic-ui-react";
import NavigationBar from "../components/navigationBar";

export default function ErrorPage() {
    const error: any = useRouteError();
    console.error(error);

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
                <Row>
                    <Column size={6}>
                        <Segment raised textAlign="center">
                            <Header size="medium">
                                Please do a screenshot of this page an create an
                                issue on{" "}
                                <a
                                    href="https://github.com/SenseiUsagi/umap-to-uefn-converter/issues"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Github.
                                </a>
                                (unless its just "Not Found")
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised>
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
