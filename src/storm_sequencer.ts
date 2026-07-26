import { SafeZoneKeyFrame, UEFNLabelStrings } from "./constants";

export function generateSequence(
    stormData: SafeZoneKeyFrame[],
    formDelay: number,
    initialRadius: number,
    initialPosX: number,
    initialPosY: number
): string {
    let finalSequence: string = UEFNLabelStrings.beginObject(
        "Class=/Script/CurveEditor.CurveEditorCopyBuffer"
    );

    // CloudStartingBias
    finalSequence += UEFNLabelStrings.beginCurveEditorKey(0);
    if (formDelay <= 0) {
        finalSequence += UEFNLabelStrings.curveEditorPosition(0, 0, 0);
        finalSequence += UEFNLabelStrings.curveEditorLinear(0);
        finalSequence += UEFNLabelStrings.safeZoneCloudBias;
        finalSequence += UEFNLabelStrings.curveEditorEndObject;
        finalSequence += UEFNLabelStrings.curveEditorCurve(0);
    } else {
        const destinationTime = formDelay / 2;
        finalSequence += UEFNLabelStrings.curveEditorPosition(0, 0, 1);
        finalSequence += UEFNLabelStrings.curveEditorLinear(0);
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            1,
            destinationTime,
            0
        );
        finalSequence += UEFNLabelStrings.curveEditorAuto(1);
        finalSequence += UEFNLabelStrings.safeZoneCloudBias;
        finalSequence += UEFNLabelStrings.curveEditorEndObject;
        finalSequence += UEFNLabelStrings.curveEditorCurve(0);
    }

    let keyPositionIndex = 0;
    let currentInputTime = formDelay;

    // SafeZoneScale
    let previousRadius = initialRadius / 1900;
    let safeZoneScale: string = ""
    safeZoneScale += UEFNLabelStrings.beginCurveEditorKey(1);
    safeZoneScale += UEFNLabelStrings.curveEditorPosition(0, 0, previousRadius);
    safeZoneScale += UEFNLabelStrings.curveEditorLinear(0);
    
    // Pos X
    let previousPosX = initialPosX;
    let positionX: string = "";
    positionX += UEFNLabelStrings.beginCurveEditorKey(2);
    positionX += UEFNLabelStrings.curveEditorPosition(0, 0, previousPosX);
    positionX += UEFNLabelStrings.curveEditorLinear(0);
    
    // Pos Y
    // For some reason somewhere in the original material the y position is multiplied by -1
    // If actual y position is used the storm center will not be in the correct location
    // I am too lazy to change the material for it as it could break a lot of shit 
    // so I just change the y position here
    // This is not true; Epics implementation of the LUF coordinates makes it 
    // so that positive Y is shown as negative Y and vise versa
    let previousPosY = initialPosY * -1;
    let positionY: string = "";
    positionY += UEFNLabelStrings.beginCurveEditorKey(3);
    positionY += UEFNLabelStrings.curveEditorPosition(0, 0, previousPosY);
    positionY += UEFNLabelStrings.curveEditorLinear(0);

    for (let index = 0; index < stormData.length; index++) {
        const element = stormData[index];
        const destinationWaitTime = currentInputTime + element.waitTime;
        const destinationResizeTime = destinationWaitTime + element.resizeTime;
        currentInputTime = destinationResizeTime;

        // SafeZoneScale
        const radius = element.radius / 1900;
        safeZoneScale += UEFNLabelStrings.curveEditorPosition(
            keyPositionIndex + 1,
            destinationWaitTime,
            previousRadius
        );
        safeZoneScale += UEFNLabelStrings.curveEditorLinear(
            keyPositionIndex + 1
        );
        safeZoneScale += UEFNLabelStrings.curveEditorPosition(
            keyPositionIndex + 2,
            destinationResizeTime,
            radius
        );
        safeZoneScale += UEFNLabelStrings.curveEditorLinear(
            keyPositionIndex + 2
        );

        // X Position
        
        positionX += UEFNLabelStrings.curveEditorPosition(
            keyPositionIndex + 1,
            destinationWaitTime,
            previousPosX
        );
        positionX += UEFNLabelStrings.curveEditorLinear(
            keyPositionIndex + 1
        );
        positionX += UEFNLabelStrings.curveEditorPosition(
            keyPositionIndex + 2,
            destinationResizeTime,
            element.PosX
        );
        positionX += UEFNLabelStrings.curveEditorLinear(
            keyPositionIndex + 2
        );

        // Y Position
        
        positionY += UEFNLabelStrings.curveEditorPosition(
            keyPositionIndex + 1,
            destinationWaitTime,
            previousPosY
        );
        positionY += UEFNLabelStrings.curveEditorLinear(
            keyPositionIndex + 1
        );
        positionY += UEFNLabelStrings.curveEditorPosition(
            keyPositionIndex + 2,
            destinationResizeTime,
            element.PosY * -1
        );
        positionY += UEFNLabelStrings.curveEditorLinear(
            keyPositionIndex + 2
        );

        
        keyPositionIndex += 2;
        previousPosX = element.PosX;
        previousPosY = element.PosY * -1;
        previousRadius = radius;
    }

    // SafeZoneScale
    finalSequence += safeZoneScale;
    finalSequence += UEFNLabelStrings.safeZoneScale;
    finalSequence += UEFNLabelStrings.curveEditorEndObject;
    finalSequence += UEFNLabelStrings.curveEditorCurve(1);

    // X Position
    finalSequence += positionX;
    finalSequence += UEFNLabelStrings.safeZonePosX;
    finalSequence += UEFNLabelStrings.curveEditorEndObject;
    finalSequence += UEFNLabelStrings.curveEditorCurve(2);

    // Y Position
    finalSequence += positionY;
    finalSequence += UEFNLabelStrings.safeZonePosY;
    finalSequence += UEFNLabelStrings.curveEditorEndObject;
    finalSequence += UEFNLabelStrings.curveEditorCurve(3);

    finalSequence += "End Object";

    return finalSequence;
}
