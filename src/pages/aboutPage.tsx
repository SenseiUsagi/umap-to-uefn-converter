import React from "react";
import { Header, Segment } from "semantic-ui-react";
import { Column, Container, Row } from "../components/gridsystem";

function AboutPage() {
    return (
        <>
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
                            <Header size="large">
                                Information according to § 5 TMG:
                            </Header>
                            <Header size="medium">Julian Runge</Header>
                            <Header size="medium">Steigerwaldstraße 43</Header>
                            <Header size="medium">90409 Nürnberg</Header>
                            <Header size="medium">Germany</Header>
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
                <Row>
                    <Column size={6}>
                        <Segment raised>
                            <Header size="large">
                                Links to Third-Party Websites:
                            </Header>
                            <Header size="medium">
                                Our website contains links to external websites
                                that are not operated by us. These links are
                                provided for your convenience and reference
                                only. We do not have control over these websites
                                and are not responsible for their content or
                                availability. The inclusion of links does not
                                necessarily imply a recommendation or endorse
                                the views expressed within them. Please note
                                that when you click on links to external
                                websites, you are subject to their terms of use
                                and privacy policies, which may differ from
                                ours. We encourage you to review the policies of
                                these websites before providing any personal
                                information. We do not accept any responsibility
                                or liability for the privacy practices or
                                content of external websites.
                            </Header>
                        </Segment>
                    </Column>
                </Row>
            </Container>
        </>
    );
}

export default AboutPage;
