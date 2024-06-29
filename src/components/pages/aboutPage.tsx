import React from "react";
import { Header, Segment } from "semantic-ui-react";

function AboutPage() {
	return (
		<>
			<Segment raised>
				<Header size="huge">Imprint</Header>
			</Segment>
			<Segment raised>
				<Header size="large">Information according to § 5 TMG:</Header>
				<Header size="medium">Julian Runge</Header>
				<Header size="medium">Steigerwaldstraße 43</Header>
				<Header size="medium">90409 Nürnberg</Header>
				<Header size="medium">Germany</Header>
			</Segment>
			<Segment raised>
				<Header size="large">Contact:</Header>
				<Header size="medium">Email: sensei_usagi@icloud.com</Header>
			</Segment>
			<Segment raised>
				<Header size="large">Responsible for content:</Header>
				<Header size="medium">Julian Runge</Header>
				<Header size="medium">Steigerwaldstraße 43</Header>
				<Header size="medium">90409 Nürnberg</Header>
				<Header size="medium">Germany</Header>
			</Segment>
		</>
	);
}

export default AboutPage;
