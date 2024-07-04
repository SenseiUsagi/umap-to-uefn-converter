import React from "react";
import { Header, Segment } from "semantic-ui-react";
import { Column, Container, Row } from "../components/gridsystem";
import NavigationBar from "../components/navigationBar";

function AboutPage() {
    return (
        <>
            <NavigationBar />
            <div style={{ minHeight: "2.85714286em" }}></div>
            <Container>
                <Row>
                    <Column size={6}>
                        <Segment raised>
                            <Header size="huge">Imprint:</Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised>
                            <Header size="large">Contact:</Header>
                            <Header size="medium">
                                Email: sensei_usagi@icloud.com
                            </Header>
                        </Segment>
                    </Column>
                </Row>
                <Row>
                    <Column size={6}>
                        <Segment raised>
                            <Header size="large">
                                Responsible for content:
                            </Header>
                            <Header size="medium">Julian Runge</Header>
                            <Header size="medium">Steigerwaldstraße 43</Header>
                            <Header size="medium">90409 Nürnberg</Header>
                            <Header size="medium">Germany</Header>
                        </Segment>
                    </Column>
                </Row>
            </Container>
        </>
    );
}

export default AboutPage;
