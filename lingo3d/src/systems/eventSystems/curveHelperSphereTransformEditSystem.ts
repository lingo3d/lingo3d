import { curveHelperSpherePointMap } from "../../collections/curveHelperSpherePointMap"
import Curve from "../../display/Curve"
import HelperSphere from "../../display/core/utils/HelperSphere"
import { onTransformEdit } from "../../events/onTransformEdit"
import { configCurveSystemPtr } from "../../pointers/configCurveSystemPtr"
import createInternalSystem from "../utils/createInternalSystem"

export const curveHelperSphereTransformEditSystem = createInternalSystem(
    "curveHelperSphereTransformEditSystem",
    {
        update: (self: HelperSphere, _, { target, phase, mode }) => {
            if (self !== target || mode !== "translate" || phase !== "end")
                return
            const pt = curveHelperSpherePointMap.get(self)!
            pt.x = self.x
            pt.y = self.y
            pt.z = self.z
            configCurveSystemPtr[0].add(self.parent as Curve)
        },
        updateTicker: onTransformEdit
    }
)
