// Required
import React from "react";
import { Segment, TransitionablePortal, Header, Icon } from "semantic-ui-react";

// State
import GlobalStore, { GlobalState } from "../state/globalstate";
// Generic
import "./popUp.css";
import { PopUpTypes } from "../constants";
import useMobileSize from "../hooks/useMobileSize";

// A small box that will show up in the bottom right of the screen
function NotifyPopUp() {
	const globalState: GlobalState = {
		...GlobalStore((state) => state),
	};

	// Check if we have reached mobile screen size
	const isMobileSize = useMobileSize();

	// Only render anything if its actually supposed to be open
	if (globalState.popUp.isOpen && globalState.popUp.animationStarted !== null) {
		return (
			<TransitionablePortal
				open={globalState.popUp.isOpen}
				transition={{ animation: "fly up", duration: 650 }}
				// Pop up will close when pressing the X or clicking anywhere on the page
				onClose={() => {
					globalState.closePopUp();
				}}
			>
				<Segment
					// Types are: Yellow (WARNING), Green (SUCCESS), Red (ERROR)
					color={
						globalState.popUp.type === PopUpTypes.SUCCESS
							? "green"
							: globalState.popUp.type === PopUpTypes.WARNING
							? "yellow"
							: "red"
					}
					inverted
					// If mobile size then just have its width be the whole screen
					className={`popUpContent popUpContentFixed ${isMobileSize ? "mobileSize" : ""}`}
				>
					<Header>
						<div className="popUpTitle">{globalState.popUp.title}</div>
						<div
							className="closeButton"
							onClick={() => {
								globalState.closePopUp();
							}}
						>
							{/* X to close the pop up */}
							<Icon inverted size="small" name="close" color="grey" />
						</div>
					</Header>
					<div>{globalState.popUp.content}</div>
				</Segment>
			</TransitionablePortal>
		);
	}
}

export default NotifyPopUp;
