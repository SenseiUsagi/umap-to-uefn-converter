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
    console.log("Completed starting bias");

    let keyPositionIndex = 0;

    // SafeZoneScale
    let previousRadius = initialRadius / 1900;
    finalSequence += UEFNLabelStrings.beginCurveEditorKey(1);
    finalSequence += UEFNLabelStrings.curveEditorPosition(0, 0, previousRadius);
    finalSequence += UEFNLabelStrings.curveEditorLinear(0);
    let currentInputTime = formDelay;
    for (let index = 0; index < stormData.length; index++) {
        const element = stormData[index];
        const destinationWaitTime = currentInputTime + element.waitTime;
        const destinationResizeTime = destinationWaitTime + element.resizeTime;
        currentInputTime = destinationResizeTime;
        const radius = element.radius / 1900;
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            keyPositionIndex + 1,
            destinationWaitTime,
            previousRadius
        );
        finalSequence += UEFNLabelStrings.curveEditorLinear(
            keyPositionIndex + 1
        );
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            keyPositionIndex + 2,
            destinationResizeTime,
            radius
        );
        finalSequence += UEFNLabelStrings.curveEditorLinear(
            keyPositionIndex + 2
        );
        keyPositionIndex += 2;
        previousRadius = radius;
    }
    finalSequence += UEFNLabelStrings.safeZoneScale;
    finalSequence += UEFNLabelStrings.curveEditorEndObject;
    finalSequence += UEFNLabelStrings.curveEditorCurve(1);

    console.log("Completed scale");
    keyPositionIndex = 0;

    // Pos X
    let previousPosX = initialPosX;
    finalSequence += UEFNLabelStrings.beginCurveEditorKey(2);
    finalSequence += UEFNLabelStrings.curveEditorPosition(0, 0, previousPosX);
    finalSequence += UEFNLabelStrings.curveEditorLinear(0);
    currentInputTime = formDelay;
    for (let index = 0; index < stormData.length; index++) {
        const element = stormData[index];
        const destinationWaitTime = currentInputTime + element.waitTime;
        const destinationResizeTime = destinationWaitTime + element.resizeTime;
        currentInputTime = destinationResizeTime;
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            keyPositionIndex + 1,
            destinationWaitTime,
            previousPosX
        );
        finalSequence += UEFNLabelStrings.curveEditorLinear(
            keyPositionIndex + 1
        );
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            keyPositionIndex + 2,
            destinationResizeTime,
            element.PosX
        );
        finalSequence += UEFNLabelStrings.curveEditorLinear(
            keyPositionIndex + 2
        );

        previousPosX = element.PosX;
        keyPositionIndex += 2;
    }
    finalSequence += UEFNLabelStrings.safeZonePosX;
    finalSequence += UEFNLabelStrings.curveEditorEndObject;
    finalSequence += UEFNLabelStrings.curveEditorCurve(2);
    console.log("Completed pos x");
    keyPositionIndex = 0;

    // Pos Y
    let previousPosY = initialPosY * -1;
    finalSequence += UEFNLabelStrings.beginCurveEditorKey(3);
    finalSequence += UEFNLabelStrings.curveEditorPosition(0, 0, previousPosY);
    finalSequence += UEFNLabelStrings.curveEditorLinear(0);
    currentInputTime = formDelay;
    for (let index = 0; index < stormData.length; index++) {
        console.log("Here");
        const element = stormData[index];
        const destinationWaitTime = currentInputTime + element.waitTime;
        const destinationResizeTime = destinationWaitTime + element.resizeTime;
        currentInputTime = destinationResizeTime;
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            keyPositionIndex + 1,
            destinationWaitTime,
            previousPosY
        );
        finalSequence += UEFNLabelStrings.curveEditorLinear(
            keyPositionIndex + 1
        );
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            keyPositionIndex + 2,
            destinationResizeTime,
            element.PosY * -1
        );
        finalSequence += UEFNLabelStrings.curveEditorLinear(
            keyPositionIndex + 2
        );

        previousPosY = element.PosY * -1;
        keyPositionIndex += 2;
    }
    finalSequence += UEFNLabelStrings.safeZonePosY;
    finalSequence += UEFNLabelStrings.curveEditorEndObject;
    finalSequence += UEFNLabelStrings.curveEditorCurve(3);
    console.log("Completed pos y");

    finalSequence += "End Object";

    return finalSequence;
}
