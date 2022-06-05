import { distance3d, Point3d } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import Tetrahedron from "./primitives/Tetrahedron"
import { vector3 } from "./utils/reusables"

export default class Bone extends Tetrahedron {
    public constructor() {
        super()
        this.wireframe = true
        this.width = 10
        this.depth = 10
        
        this.createEffect(() => {
            const from = this.fromState.get()
            const to = this.toState.get()

            const { x: x0, y: y0, z: z0 } = from
            const { x: x1, y: y1, z: z1 } = to

            const h = this.height = distance3d(x0, y0, z0, x1, y1, z1)
            this.innerY = h / 2

            const direction = vector3.set
            
        }, [this.fromState.get, this.toState.get])
    }

    private fromState = new Reactive(new Point3d(0, 0, 0))
    public get from() {
        return this.fromState.get()
    }
    public set from(val) {
        this.fromState.set(val)
    }

    private toState = new Reactive(new Point3d(100, 100, 100))
    public get to() {
        return this.toState.get()
    }
    public set to(val) {
        this.toState.set(val)
    }
}