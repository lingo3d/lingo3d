import { Reactive } from "@lincode/reactivity"
import { debounceInstance } from "@lincode/utils"
import { PerspectiveCamera } from "three"
import Appendable from "../../api/core/Appendable"
import PositionedItem from "../../api/core/PositionedItem"
import { onSceneGraphChange } from "../../events/onSceneGraphChange"
import ICameraBase from "../../interface/ICameraBase"
import CameraBase from "./CameraBase"
import MeshItem, { isMeshItem } from "./MeshItem"
import VisibleObjectManager from "./VisibleObjectManager"

const attachSet = new WeakSet<Appendable>()

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

    private static retaget = debounceInstance(
        (instance: OrbitCameraBase) => {
            let target = instance.manualTarget
            for (const child of instance.children ?? [])
                if (target) {
                    if (child.outerObject3d.parent !== instance.camera)
                        instance.camera[
                            attachSet.has(child) ? "attach" : "add"
                        ](child.outerObject3d)
                } else if (isMeshItem(child)) {
                    target = child
                    const { parent } = instance.outerObject3d
                    if (parent && child.outerObject3d.parent !== parent)
                        parent[attachSet.has(target) ? "attach" : "add"](
                            target.outerObject3d
                        )
                }
            instance.targetState.set(target)
        },
        0,
        "trailing"
    )
    private retarget() {
        OrbitCameraBase.retaget(this, this)
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
