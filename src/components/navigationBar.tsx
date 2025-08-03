import React from "react";
import { Icon, Menu, MenuItem } from "semantic-ui-react";
import { Link, Outlet } from "react-router-dom";
import useTabletSize from "../hooks/useTabletSize";
import GlobalStore, { GlobalState } from "../state/globalstate";
import { linkReferences } from "../constants";

function NavigationBar() {
    const isTabletSize = useTabletSize();
    const globalState: GlobalState = {
        ...GlobalStore((state) => state),
    };

    return (
        <>
            <Menu fixed="top" inverted size="huge" borderless color="black">
                <MenuItem as={Link} to="/">
                    <Icon name="file code outline" />
                    Converter
                </MenuItem>
                <MenuItem as={Link} to="imprint">
                    <Icon name="legal" />
                    Imprint
                </MenuItem>
                <MenuItem as={Link} to="examples">
                    <Icon name="file alternate outline" />
                    Examples
                </MenuItem>
                <MenuItem as={Link} to="settings">
                    <Icon name="settings" />
                    Settings
                </MenuItem>
                <MenuItem as={Link} to="help">
                    <Icon name="help" />
                    Help
                </MenuItem>
                {!isTabletSize && (
                    <MenuItem
                        position="right"
                        as="a"
                        href={linkReferences.ytChannel}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Created by: Sensei Usagi
                    </MenuItem>
                )}
            </Menu>
            <Outlet />
        </>
    );
}

export default NavigationBar;
