import { Object3D, PropertyBinding, Quaternion, Vector3 } from "three"
import getWorldDirection from "../../display/utils/getWorldDirection"
import getWorldPosition from "../../display/utils/getWorldPosition"
import { ray, vector3 } from "../../display/utils/reusables"
import { vec2Point } from "../../display/utils/vec2Point"
import { onAfterRender } from "../../events/onAfterRender"
import { CM2M } from "../../globals"
import IMeshAppendable from "../../interface/IMeshAppendable"
import renderSystemAutoClear from "../../utils/renderSystemAutoClear"
import { setManager } from "../utils/getManager"
import Appendable from "./Appendable"

const [addTransformSystem, deleteTransformSystem] = renderSystemAutoClear(
    (manager: MeshAppendable) => {
        console.log(manager)
    },
    onAfterRender
)

export default class MeshAppendable<T extends Object3D = Object3D>
    extends Appendable
    implements IMeshAppendable
{
    public object3d: T
    public position: Vector3
    public quaternion: Quaternion
    public userData: Record<string, any>

    public constructor(public outerObject3d: T = new Object3D() as T) {
        super()
        setManager(outerObject3d, this)
        this.initTransformDetector()
        this.object3d = outerObject3d
        this.position = outerObject3d.position
        this.quaternion = outerObject3d.quaternion
        this.userData = outerObject3d.userData
    }

    private matrixWorldNeedsUpdate?: boolean
    protected initTransformDetector() {
        Object.defineProperty(this.outerObject3d, "matrixWorldNeedsUpdate", {
            get: () => this.matrixWorldNeedsUpdate,
            set: (val) => {
                this.matrixWorldNeedsUpdate = val
                val && addTransformSystem(this)
            }
        })
    }

    public declare parent?: MeshAppendable
    public declare children?: Set<Appendable | MeshAppendable>

    public declare traverse: (
        cb: (appendable: Appendable | MeshAppendable) => void
    ) => void

    public declare traverseSome: (
        cb: (appendable: Appendable | MeshAppendable) => unknown
    ) => boolean

    public override append(child: Appendable | MeshAppendable) {
        this.appendNode(child)
        "object3d" in child && this.object3d.add(child.outerObject3d)
    }

    public attach(child: Appendable | MeshAppendable) {
        this.appendNode(child)
        "object3d" in child && this.object3d.attach(child.outerObject3d)
    }

    protected override disposeNode() {
        super.disposeNode()
        this.outerObject3d.parent?.remove(this.outerObject3d)
        deleteTransformSystem(this)
    }

    public override get name() {
        return super.name
    }
    public override set name(val) {
        super.name = this.outerObject3d.name = PropertyBinding.sanitizeNodeName(
            val ?? ""
        )
    }

    protected getRay() {
        return ray.set(
            getWorldPosition(this.object3d),
            getWorldDirection(this.object3d)
        )
    }

    public pointAt(distance: number) {
        return vec2Point(this.getRay().at(distance * CM2M, vector3))
    }
}
