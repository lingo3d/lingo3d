import Curve from "../display/Curve"
import HelperSphere from "../display/core/utils/HelperSphere"
import createSharedPool from "../pools/utils/createSharedPool"
import computeOnce from "./utils/computeOnce"

export default computeOnce((self: Curve) =>
    createSharedPool<HelperSphere, [x: number, y: number, z: number]>(
        (params) => {
            const helper = new HelperSphere(undefined)
            self.append(helper)
            helper.scale = 0.2
            helper.x = params[0]
            helper.y = params[1]
            helper.z = params[2]
            return helper
        },
        (geometry) => geometry.dispose()
    )
)
