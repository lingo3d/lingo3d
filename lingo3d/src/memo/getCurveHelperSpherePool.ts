import { curveHelperSpherePointMap } from "../collections/curveHelperSpherePointMap"
import Curve from "../display/Curve"
import HelperSphere from "../display/core/utils/HelperSphere"
import createSharedPool from "../pools/utils/createSharedPool"
import { addCurveHelperSphereTransformEditSystem } from "../systems/eventSystems/curveHelperSphereTransformEditSystem"
import { getSelectionCandidates } from "../throttle/getSelectionCandidates"
import { Point3dType } from "../utils/isPoint"
import computeOnce from "./utils/computeOnce"

export default computeOnce((self: Curve) =>
    createSharedPool<HelperSphere, [], Point3dType>(
        (_, pt) => {
            const helper = new HelperSphere(undefined)
            self.append(helper)
            helper.scale = 0.2
            helper.x = pt.x
            helper.y = pt.y
            helper.z = pt.z
            curveHelperSpherePointMap.set(helper, pt)
            addCurveHelperSphereTransformEditSystem(helper)
            getSelectionCandidates()
            return helper
        },
        (helper) => helper.dispose()
    )
)
