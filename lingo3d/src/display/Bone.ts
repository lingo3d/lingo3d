import { distance3d } from "@lincode/math"
import randomColor from "randomcolor"
import { Object3D } from "three"
import { getSelectionTarget } from "../states/useSelectionTarget"
import unsafeGetValue from "../utils/unsafeGetValue"
import Octahedron from "./primitives/Octahedron"
import diffQuaternions from "./utils/diffQuaternions"
import getWorldPosition from "./utils/getWorldPosition"
import { vec2Point } from "./utils/vec2Point"

export default class Bone extends Octahedron {
    public constructor(target: Object3D, child: Object3D) {
        super()
        // hiddenAppendables.add(this)

        const color = randomColor()

        this.wireframe = true
        const thisMaterial = unsafeGetValue(this.nativeObject3d, "material")
        thisMaterial.depthTest = false
        this.color = color
        this.width = 2
        this.height = 2
        this.depth = 2

        const joint = new Octahedron()
        this.append(joint)
        joint.scale = 0.05
        joint.wireframe = true
        const jointMaterial = unsafeGetValue(joint.nativeObject3d, "material")
        jointMaterial.depthTest = false
        joint.color = color

        this.createEffect(() => {
            if (getSelectionTarget() !== this) return

            this.color = "blue"
            joint.color = "blue"

            return () => {
                this.color = color
                joint.color = color
            }
        }, [getSelectionTarget])

        const from = vec2Point(getWorldPosition(target))
        const to = vec2Point(getWorldPosition(child))

        const { x: x0, y: y0, z: z0 } = from
        const { x: x1, y: y1, z: z1 } = to

        this.x = x0
        this.y = y0
        this.z = z0

        const h = (this.depth = distance3d(x0, y0, z0, x1, y1, z1))
        this.innerZ = h * 0.5
        const t = (this.width = this.height = h * 0.2)
        joint.scale = t * 0.01

        // this.lookAt(to)

        const targetQuat = target.quaternion.clone()
        const myQuat = this.outerObject3d.quaternion.clone()

        this.onLoop = () => {
            const diff = diffQuaternions(this.outerObject3d.quaternion, myQuat)
            target.quaternion.copy(targetQuat.clone().multiply(diff))
        }
    }
}
