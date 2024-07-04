import React from "react";
import NavigationBar from "../components/navigationBar";
import NotifyPopUp from "../components/popUp";

function Layout() {
    return (
        <>
            <NavigationBar />
            <div style={{ minHeight: "2.85714286em" }}></div>
            <NotifyPopUp />
        </>
    );
}

export default Layout;
