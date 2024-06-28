import React from "react";
import { Image } from "semantic-ui-react";
import itsNikLogo from "../assets/img/itsnik_profile.png";
import senseLogo from "../assets/imgsense_profile.jpg";

interface customIconsInterface {
    name: string;
    className?: string;
    size?: string;
    color?: string;
}

const TriIcons: React.FC<customIconsInterface> = ({
    name,
    className,
    size = "1em",
}) => {
    const iconPaths: { [key: string]: string } = {
        itsNikLogo: itsNikLogo,
        senseLogo: senseLogo,
    };

    return (
        <Image
            src={iconPaths[name]}
            alt={name}
            className={className}
            style={{
                width: size,
                height: size,
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "0.5rem",
            }}
        />
    );
};

export default TriIcons;
