import React from "react";
import { Icon, Menu, MenuItem } from "semantic-ui-react";

function NavigationBar() {
    return (
        <Menu fixed="top" inverted size="huge" borderless>
            <MenuItem as="a">
                <Icon name="home" />
                Home
            </MenuItem>
            <MenuItem as="a">
                <Icon name="legal" />
                About
            </MenuItem>
            <MenuItem as="a">
                <Icon name="file alternate outline" />
                Examples
            </MenuItem>
            <MenuItem as="a">
                <Icon name="settings" />
                Settings
            </MenuItem>
            <MenuItem position="right">.umap to UEFN converter</MenuItem>
            <MenuItem as="a">Created by: Sensei Usagi</MenuItem>
        </Menu>
    );
}

export default NavigationBar;
