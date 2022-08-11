import { Reactive } from "@lincode/reactivity"
import { PerspectiveCamera } from "three"
import Appendable from "../../api/core/Appendable"
import PositionedItem from "../../api/core/PositionedItem"
import { onSceneGraphChange } from "../../events/onSceneGraphChange"
import ICameraBase from "../../interface/ICameraBase"
import queueDebounce from "../../utils/queueDebounce"
import CameraBase from "./CameraBase"
import MeshItem, { isMeshItem } from "./MeshItem"

const attachSet = new WeakSet<Appendable>()

const queueRetarget = queueDebounce()

export default class OrbitCameraBase
    extends CameraBase<PerspectiveCamera>
    implements ICameraBase
{
    public constructor(camera: PerspectiveCamera) {
        super(camera)

        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target) return

            const handle = onSceneGraphChange(
                () => target.parent !== this && this.retarget()
            )

            return () => {
                handle.cancel()
            }
        }, [this.targetState.get])
    }

    protected manualTarget?: MeshItem
    protected targetState = new Reactive<MeshItem | undefined>(undefined)

    private retarget() {
        queueRetarget(this, () => {
            let target = this.manualTarget
            for (const child of this.children ?? [])
                if (target) {
                    if (child.outerObject3d.parent !== this.camera)
                        this.camera[attachSet.has(child) ? "attach" : "add"](
                            child.outerObject3d
                        )
                } else if (isMeshItem(child)) {
                    target = child
                    const { parent } = this.outerObject3d
                    if (parent && child.outerObject3d.parent !== parent)
                        parent[attachSet.has(target) ? "attach" : "add"](
                            target.outerObject3d
                        )
                }
            this.targetState.set(target)
        })
    }

    public override append(object: PositionedItem) {
        this._append(object)
        attachSet.delete(object)
        this.retarget()
    }

    public override attach(object: PositionedItem) {
        this._append(object)
        attachSet.add(object)
        this.retarget()
    }
}
