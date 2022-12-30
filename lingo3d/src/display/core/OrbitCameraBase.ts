import { Reactive } from "@lincode/reactivity"
import { PerspectiveCamera } from "three"
import CameraBase from "./CameraBase"
import MeshManager, { isMeshManager } from "./MeshManager"
import { getMeshManagerSets } from "../core/StaticObjectManager"
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
        return isMeshManager(firstChild) ? firstChild : undefined
    }

    public constructor(camera: PerspectiveCamera) {
        super(camera)

        this.createEffect(() => {
            const target = this.getChild() ?? this.targetState.get()
            if (!target) return

            const [[targetManager]] = getMeshManagerSets(target)
            if (targetManager) {
                this.foundState.set(targetManager)
                const handle = onSceneGraphChange(
                    () =>
                        targetManager.parent !== this &&
                        this.refreshState.set({})
                )
                return () => {
                    handle.cancel()
                }
            }
            if (typeof target !== "string") return

            const handle = onId(
                (id) => id === target && this.refreshState.set({})
            )
            return () => {
                handle.cancel()
            }
        }, [this.targetState.get, this.refreshState.get])
    }

    private targetState = new Reactive<string | MeshManager | undefined>(
        undefined
    )
    public get target() {
        return this.targetState.get()
    }
    public set target(value) {
        this.targetState.set(value)
    }

    protected foundState = new Reactive<MeshManager | undefined>(undefined)
    private refreshState = new Reactive({})

    public override append(object: MeshManager) {
        this._append(object)
        this.parent?.outerObject3d.add(object.outerObject3d)
        this.refreshState.set({})
    }

    public override attach(object: MeshManager) {
        this._append(object)
        this.parent?.outerObject3d.attach(object.outerObject3d)
        this.refreshState.set({})
    }
}
