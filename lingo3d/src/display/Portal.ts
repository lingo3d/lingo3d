import { Reactive } from "@lincode/reactivity"
import {
    WebGLRenderTarget,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera
} from "three"
import MeshAppendable from "../api/core/MeshAppendable"
import scene from "../engine/scene"
import { onBeforeRender } from "../events/onBeforeRender"
import { getCameraRendered } from "../states/useCameraRendered"
import { rendererPtr } from "../states/useRenderer"
import VisibleObjectManager from "./core/VisibleObjectManager"
import { planeGeometry } from "./primitives/Plane"
import getWorldPosition from "./utils/getWorldPosition"
import getWorldQuaternion from "./utils/getWorldQuaternion"
import { complementQuaternion, diffQuaternions } from "./utils/quaternions"

export default class Portal extends VisibleObjectManager {
    public constructor() {
        const renderTarget = new WebGLRenderTarget(100, 100)
        const material = new MeshBasicMaterial({
            map: renderTarget.texture
        })
        const mesh = new Mesh(planeGeometry, material)
        super(mesh)

        const camera = new PerspectiveCamera()
        this.createEffect(() => {
            const { width, height } = this
            renderTarget.setSize(width, height)
            camera.aspect = width / height
            camera.updateProjectionMatrix()
        }, [this.refreshState.get])

        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target) return

            const cameraRendererd = getCameraRendered()

            camera.position.copy(getWorldPosition(target.outerObject3d))
            camera.quaternion.copy(getWorldQuaternion(target.outerObject3d))

            const handle = onBeforeRender(() => {
                camera.quaternion.copy(getWorldQuaternion(target.outerObject3d))
                complementQuaternion(
                    camera.quaternion,
                    diffQuaternions(
                        getWorldQuaternion(cameraRendererd),
                        getWorldQuaternion(this.outerObject3d)
                    )
                )
                camera.position.copy(getWorldPosition(target.outerObject3d))

                mesh.visible = false
                target.outerObject3d.visible = false
                rendererPtr[0].setRenderTarget(renderTarget)
                rendererPtr[0].render(scene, camera)
                rendererPtr[0].setRenderTarget(null)
                mesh.visible = true
                target.outerObject3d.visible = true
            })
            return () => {
                handle.cancel()
            }
        }, [this.targetState.get, getCameraRendered])

        this.then(() => {
            renderTarget.dispose()
            material.dispose()
        })
    }

    private refreshState = new Reactive({})

    public override get width() {
        return super.width
    }
    public override set width(val) {
        super.width = val
        this.refreshState.set({})
    }

    public override get height() {
        return super.height
    }
    public override set height(val) {
        super.height = val
        this.refreshState.set({})
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}

    private targetState = new Reactive<MeshAppendable | undefined>(undefined)
    public set target(val: MeshAppendable | undefined) {
        this.targetState.set(val)
    }
}
