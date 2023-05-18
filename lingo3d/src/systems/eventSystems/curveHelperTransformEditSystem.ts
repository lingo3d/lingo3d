import Curve from "../../display/Curve"
import HelperSphere from "../../display/core/utils/HelperSphere"
import { onTransformEdit } from "../../events/onTransformEdit"
import { Point3dType } from "../../utils/isPoint"
import { addConfigCurveSystem } from "../configSystems/configCurveSystem"
import eventSimpleSystem from "../utils/eventSimpleSystem"

export const [addCurveHelperTransformEditSystem] = eventSimpleSystem(
    (
        {
            helper,
            self,
            pt
        }: { helper: HelperSphere; self: Curve; pt: Point3dType },
        { target, phase, mode }
    ) => {
        if (mode !== "translate" || phase !== "end" || target !== helper) return
        Object.assign(pt, helper.getWorldPosition())
        addConfigCurveSystem(self)
    },
    onTransformEdit
)
