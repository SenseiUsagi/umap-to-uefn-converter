import { useEffect, useState } from "react";

// This is a copy of the useMobileSize hook but for tablet size
function useTabletSize() {
    const [isTabletSize, setIsTabletSize] = useState(false);

    function isTabletSizeCheck() {
        setIsTabletSize(window.innerWidth <= 1024);
    }

    useEffect(() => {
        window.addEventListener("resize", isTabletSizeCheck);
        isTabletSizeCheck();
        return () => {
            window.removeEventListener("resize", isTabletSizeCheck);
        };
    });

    return isTabletSize;
}

export default useTabletSize;
