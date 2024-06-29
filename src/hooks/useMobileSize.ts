import { useEffect, useState } from "react";

// This custom cook checks if the currect window screen has reached mobile size
// and will return a bool if it is or not
function useMobileSize() {
	// Check if we have reached mobile screen size
	const [isMobileSize, setIsMobileSize] = useState(false);

	// Helper function
	function isMobileSizeCheck() {
		setIsMobileSize(window.innerWidth <= 768);
	}

	// Basically checks evertime the window has been resized if its the size of a mobile screen
	// This will also execute upon first time loading, meaning its set to true if the site is opened on a phone
	useEffect(() => {
		window.addEventListener("resize", isMobileSizeCheck);
		isMobileSizeCheck();
		return () => {
			window.removeEventListener("resize", isMobileSizeCheck);
		};
	});

	return isMobileSize;
}

export default useMobileSize;
