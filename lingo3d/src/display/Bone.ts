import { distance3d } from "@lincode/math"
import { last } from "@lincode/utils"
import { Bone as ThreeBone, Quaternion } from "three"
import { getSelectionTarget } from "../states/useSelectionTarget"
import Octahedron from "./primitives/Octahedron"
import { vector3, vector3_ } from "./utils/reusables"
import { vec2Point } from "./utils/vec2Point"

const diffQuat = (A: Quaternion, B: Quaternion) => A.clone().multiply(B.clone().invert())

export default class Bone extends Octahedron {
    public constructor(
        public target: ThreeBone
    ) {
        super()
        // hiddenAppendables.add(this)

        this.wireframe = true
        this.outerObject3d.renderOrder = 999
        this.material.depthTest = false
        this.color = "red"
        this.width = 2
        this.height = 2
        this.depth = 2
        
        const joint = new Octahedron()
        this.append(joint)
        joint.scale = 0.05
        joint.wireframe = true
        joint.outerObject3d.renderOrder = 999
        //@ts-ignore
        joint.material.depthTest = false
        joint.color = "red"

        this.createEffect(() => {
            if (getSelectionTarget() !== this) return

            this.color = "blue"
            joint.color = "blue"

            return () => {
                this.color = "red"
                joint.color = "red"
            }
        }, [getSelectionTarget])

        const child = last(target.children)
        if (!child) return

        const from = vec2Point(target.getWorldPosition(vector3))
        const to = vec2Point(child.getWorldPosition(vector3_))

        const { x: x0, y: y0, z: z0 } = from
        const { x: x1, y: y1, z: z1 } = to

        this.x = x0
        this.y = y0
        this.z = z0

        const h = this.depth = distance3d(x0, y0, z0, x1, y1, z1)
        this.innerZ = h * 0.5
        const t = this.width = this.height = h * 0.1
        joint.scale = t * 0.025

        this.lookAt(to)

        const targetQuat = target.quaternion.clone()
        const myQuat = this.outerObject3d.quaternion.clone()

        this.onLoop = () => {
            const diff = diffQuat(this.outerObject3d.quaternion, myQuat)
            target.quaternion.copy(targetQuat.clone().multiply(diff))
        }
    }
}