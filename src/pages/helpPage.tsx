import React from "react";
import { Segment } from "semantic-ui-react";
import NavigationBar from "../components/navigationBar";

function HelpPage() {
    return (
        <>
            <NavigationBar />
            <div style={{ minHeight: "2.85714286em" }}></div>
            <Segment>help goes here</Segment>
        </>
    );
}

export default HelpPage;
