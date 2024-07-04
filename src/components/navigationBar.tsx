import React from "react";
import { Icon, Menu, MenuItem } from "semantic-ui-react";
import GlobalStore, { GlobalState } from "../state/globalstate";
import useMobileSize from "../hooks/useMobileSize";
import { Link, Outlet } from "react-router-dom";

function NavigationBar() {
    const globalState: GlobalState = {
        ...GlobalStore((state) => state),
    };

    const isMobileSize = useMobileSize();

    return (
        <>
            <Menu fixed="top" inverted size="huge" borderless>
                <MenuItem as={Link} to="/">
                    <Icon name="file code outline" />
                    Converter
                </MenuItem>
                <MenuItem as={Link} to="/imprint">
                    <Icon name="legal" />
                    Imprint
                </MenuItem>
                <MenuItem as={Link} to="/examples">
                    <Icon name="file alternate outline" />
                    Examples
                </MenuItem>
                <MenuItem as={Link} to="/settings">
                    <Icon name="settings" />
                    Settings
                </MenuItem>
                <MenuItem as={Link} to="/help">
                    <Icon name="help" />
                    Help
                </MenuItem>
                {/* TODO: Change this to use tablet size instead */}
                {!isMobileSize && (
                    <>
                        <MenuItem position="right">
                            .umap to UEFN converter
                        </MenuItem>
                        <MenuItem
                            as="a"
                            href="https://www.youtube.com/channel/UCbM-2vwIRZHfOxhVNU75bCQ"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Created by: Sensei Usagi
                        </MenuItem>
                    </>
                )}
            </Menu>
            <Outlet />
        </>
    );
}

export default NavigationBar;
