import { distance3d, Point3d } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import { Bone as ThreeBone, Euler, Quaternion } from "three"
import { hiddenAppendables } from "../api/core/Appendable"
import { getSelectionTarget } from "../states/useSelectionTarget"
import Cube from "./primitives/Cube"
import Octahedron from "./primitives/Octahedron"
import { euler, quaternion } from "./utils/reusables"

export default class Bone extends Cube {
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

        this.createEffect(() => {
            const from = this.fromState.get()
            const to = this.toState.get()

            const { x: x0, y: y0, z: z0 } = from
            const { x: x1, y: y1, z: z1 } = to

            this.x = x0
            this.y = y0
            this.z = z0

            const h = this.depth = distance3d(x0, y0, z0, x1, y1, z1)
            this.innerZ = h * 0.5
            const t = this.width = this.height = h * 0.1
            joint.scale = t * 0.025

            // this.outerObject3d.quaternion.copy(target.getWorldQuaternion(quaternion))

            this.lookAt(to)

            const targetQuat = target.quaternion.clone()
            const myQuat = this.outerObject3d.quaternion.clone()

            const diffQuat = (A: Quaternion, B: Quaternion) => {
                return A.clone().multiply(B.clone().invert())
            }

            this.onLoop = () => {
                this.outerObject3d.quaternion
                const diff = diffQuat(this.outerObject3d.quaternion, myQuat)
                diff.x = -diff.x
                diff.y = -diff.y
                target.quaternion.copy(targetQuat.clone().multiply(diff))
            }
        }, [this.fromState.get, this.toState.get])
    }

    private fromState = new Reactive(new Point3d(0, 0, 0))
    public get from() {
        return this.fromState.get()
    }
    public set from(val) {
        this.fromState.set(val)
    }

    private toState = new Reactive(new Point3d(0, 100, 0))
    public get to() {
        return this.toState.get()
    }
    public set to(val) {
        this.toState.set(val)
    }
}