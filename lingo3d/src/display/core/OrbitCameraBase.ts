import { Reactive } from "@lincode/reactivity"
import { PerspectiveCamera } from "three"
import CameraBase from "./CameraBase"
import MeshItem, { isMeshItem } from "./MeshItem"
import { getMeshItemSets } from "../core/StaticObjectManager"
import IOrbitCameraBase from "../../interface/IOrbitCameraBase"
import { onId } from "../../events/onId"
import { onSceneGraphChange } from "../../events/onSceneGraphChange"

export default class OrbitCameraBase
    extends CameraBase
    implements IOrbitCameraBase
{
    private getChild() {
        if (!this.children) return
        const [firstChild] = this.children
        return isMeshItem(firstChild) ? firstChild : undefined
    }

    public constructor(camera: PerspectiveCamera) {
        super(camera)

        this.createEffect(() => {
            const target = this.getChild() ?? this.targetState.get()
            if (!target) return

            const [[targetItem]] = getMeshItemSets(target)
            if (targetItem) {
                this.foundState.set(targetItem)
                const handle = onSceneGraphChange(
                    () => targetItem.parent !== this && this.refresh.set({})
                )
                return () => {
                    handle.cancel()
                }
            }
            if (typeof target !== "string") return

            const handle = onId((id) => id === target && this.refresh.set({}))
            return () => {
                handle.cancel()
            }
        }, [this.targetState.get, this.refresh.get])
    }

    private targetState = new Reactive<string | MeshItem | undefined>(undefined)
    public get target() {
        return this.targetState.get()
    }
    public set target(value) {
        this.targetState.set(value)
    }

    protected foundState = new Reactive<MeshItem | undefined>(undefined)
    private refresh = new Reactive({})

    public override append(object: MeshItem) {
        this._append(object)
        this.parent?.outerObject3d.add(object.outerObject3d)
        this.refresh.set({})
    }

    public override attach(object: MeshItem) {
        this._append(object)
        this.parent?.outerObject3d.attach(object.outerObject3d)
        this.refresh.set({})
    }
}
