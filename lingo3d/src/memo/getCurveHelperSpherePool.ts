import { curveHelperSpherePointMap } from "../collections/curveHelperSpherePointMap"
import Curve from "../display/Curve"
import HelperSphere from "../display/core/helperPrimitives/HelperSphere"
import createSharedPool from "../pools/utils/createSharedPool"
import { curveHelperSphereTransformEditSystem } from "../systems/eventSystems/curveHelperSphereTransformEditSystem"
import { getSelectionCandidates } from "../throttle/getSelectionCandidates"
import { Point3dType } from "../typeGuards/isPoint"
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
            curveHelperSphereTransformEditSystem.add(helper)
            getSelectionCandidates()
            return helper
        },
        (helper) => helper.dispose()
    )
)
