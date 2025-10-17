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
            1
        );
        finalSequence += UEFNLabelStrings.curveEditorAuto(1);
        finalSequence += UEFNLabelStrings.safeZoneCloudBias;
        finalSequence += UEFNLabelStrings.curveEditorEndObject;
        finalSequence += UEFNLabelStrings.curveEditorCurve(0);
    }

    // SafeZoneScale
    let previousRadius = initialRadius / 1900;
    finalSequence += UEFNLabelStrings.beginCurveEditorKey(1);
    finalSequence += UEFNLabelStrings.curveEditorPosition(0, 0, previousRadius);
    finalSequence += UEFNLabelStrings.curveEditorLinear(0);
    for (let index = 0; index < stormData.length; index + 2) {
        const element = stormData[index];
        const destinationWaitTime = formDelay + element.waitTime;
        const destinationResizeTime = destinationWaitTime + element.resizeTime;
        const radius = element.radius / 1900;
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            index + 1,
            destinationWaitTime,
            previousRadius
        );
        finalSequence += UEFNLabelStrings.curveEditorLinear(index + 2);
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            index + 1,
            destinationResizeTime,
            radius
        );
        finalSequence += UEFNLabelStrings.curveEditorLinear(index + 2);

        previousRadius = radius;
    }
    finalSequence += UEFNLabelStrings.safeZoneCloudBias;
    finalSequence += UEFNLabelStrings.curveEditorEndObject;
    finalSequence += UEFNLabelStrings.curveEditorCurve(1);

    // Pos X
    let previousPosX = initialPosX;
    finalSequence += UEFNLabelStrings.beginCurveEditorKey(2);
    finalSequence += UEFNLabelStrings.curveEditorPosition(0, 0, previousPosX);
    finalSequence += UEFNLabelStrings.curveEditorLinear(0);
    for (let index = 0; index < stormData.length; index + 2) {
        const element = stormData[index];
        const destinationWaitTime = formDelay + element.waitTime;
        const destinationResizeTime = destinationWaitTime + element.resizeTime;
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            index + 1,
            destinationWaitTime,
            previousPosX
        );
        finalSequence += UEFNLabelStrings.curveEditorLinear(index + 2);
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            index + 1,
            destinationResizeTime,
            element.PosX
        );
        finalSequence += UEFNLabelStrings.curveEditorLinear(index + 2);

        previousRadius = element.PosX;
    }
    finalSequence += UEFNLabelStrings.safeZonePosX;
    finalSequence += UEFNLabelStrings.curveEditorEndObject;
    finalSequence += UEFNLabelStrings.curveEditorCurve(2);

    // Pos Y
    let previousPosY = initialPosY;
    finalSequence += UEFNLabelStrings.beginCurveEditorKey(3);
    finalSequence += UEFNLabelStrings.curveEditorPosition(0, 0, previousPosY);
    finalSequence += UEFNLabelStrings.curveEditorLinear(0);
    for (let index = 0; index < stormData.length; index + 2) {
        const element = stormData[index];
        const destinationWaitTime = formDelay + element.waitTime;
        const destinationResizeTime = destinationWaitTime + element.resizeTime;
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            index + 1,
            destinationWaitTime,
            previousPosY
        );
        finalSequence += UEFNLabelStrings.curveEditorLinear(index + 2);
        finalSequence += UEFNLabelStrings.curveEditorPosition(
            index + 1,
            destinationResizeTime,
            element.PosY
        );
        finalSequence += UEFNLabelStrings.curveEditorLinear(index + 2);

        previousRadius = element.PosY;
    }
    finalSequence += UEFNLabelStrings.safeZonePosY;
    finalSequence += UEFNLabelStrings.curveEditorEndObject;
    finalSequence += UEFNLabelStrings.curveEditorCurve(3);

    finalSequence += "End Object";

    return finalSequence;
}
