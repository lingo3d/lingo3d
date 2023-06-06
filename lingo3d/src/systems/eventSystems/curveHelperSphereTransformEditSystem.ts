import { curveHelperSpherePointMap } from "../../collections/curveHelperSpherePointMap"
import Curve from "../../display/Curve"
import HelperSphere from "../../display/core/utils/HelperSphere"
import { onTransformEdit } from "../../events/onTransformEdit"
import { configCurveSystemPtr } from "../../pointers/configCurveSystemPtr"
import eventSystem from "../utils/eventSystem"

export const curveHelperSphereTransformEditSystem = eventSystem(
    "curveHelperSphereTransformEditSystem",
    (self: HelperSphere, { target, phase, mode }) => {
        if (self !== target || mode !== "translate" || phase !== "end") return
        const pt = curveHelperSpherePointMap.get(self)!
        pt.x = self.x
        pt.y = self.y
        pt.z = self.z
        configCurveSystemPtr[0].add(self.parent as Curve)
    },
    onTransformEdit
)
