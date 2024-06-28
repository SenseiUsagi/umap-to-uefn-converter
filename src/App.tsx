import React, { useState } from "react";
import { Icon, Menu, MenuItem } from "semantic-ui-react";
import { Column, Container, Row } from "./components/gridsystem";
import NavigationBar from "./components/navigationBar";
import ConverterPage from "./components/pages/converterPage";

function App() {
    const convertionPage = ConverterPage();

    return (
        <>
            <NavigationBar />
            <div style={{ minHeight: "2.85714286em" }}></div>
            {convertionPage}
        </>
    );
}

export default App;
