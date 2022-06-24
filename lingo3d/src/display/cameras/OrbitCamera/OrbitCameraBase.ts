import { Reactive } from "@lincode/reactivity"
import { debounce } from "@lincode/utils"
import { PerspectiveCamera } from "three"
import Appendable from "../../../api/core/Appendable"
import PositionedItem from "../../../api/core/PositionedItem"
import { camNear, camFar } from "../../../engine/constants"
import { onSceneGraphChange } from "../../../events/onSceneGraphChange"
import ICamera from "../../../interface/ICamera"
import Nullable from "../../../interface/utils/Nullable"
import Camera from "../../cameras/Camera"
import MeshItem, { isMeshItem } from "../../core/MeshItem"

const attachSet = new WeakSet<Appendable>()

export default class OrbitCameraBase extends Camera implements ICamera {
    public constructor(camera = new PerspectiveCamera(75, 1, camNear, camFar)) {
        super(camera)

        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target) return

            const handle = onSceneGraphChange(() => target.parent !== this && this.retarget())
            
            return () => {
                handle.cancel()
            }
        }, [this.targetState.get])
    }

    public target: Nullable<MeshItem>

    protected targetState = new Reactive<MeshItem | undefined>(undefined)

    private retarget = debounce(() => {
        let target: MeshItem | undefined
        for (const child of this.children ?? [])
            if (target) {
                if (child.outerObject3d.parent !== this.camera)
                    this.camera[attachSet.has(child) ? "attach" : "add"](child.outerObject3d)
            }
            else if (isMeshItem(child)) {
                target = child
                const { parent } = this.outerObject3d
                if (parent && child.outerObject3d.parent !== parent)
                    parent[attachSet.has(target) ? "attach" : "add"](target.outerObject3d)
            }

        this.targetState.set(target)

    }, 0, "trailing")

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