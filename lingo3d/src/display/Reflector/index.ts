import store, { Reactive } from "@lincode/reactivity"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import { reflectorDefaults, reflectorSchema } from "../../interface/IReflector"
import { getCamera } from "../../states/useCamera"
import { getRenderer } from "../../states/useRenderer"
import copyStandard from "../core/SimpleObjectManager/applyMaterialProperties/copyStandard"
import Plane from "../primitives/Plane"

export default class Reflector extends Plane {
    public static override componentName = "reflector"
    public static override defaults = reflectorDefaults
    public static override schema = reflectorSchema

    public constructor() {
        super()
        this.rotationX = -90

        const [setClass, getClass] = store<any>(undefined)
        import("./MeshReflectorMaterial").then(module => setClass(module.default))

        this.createEffect(() => {
            if (this.done) return

            const MeshReflectorMaterial = getClass()
            if (!MeshReflectorMaterial) return

            const mat = new MeshReflectorMaterial(getRenderer(), getCamera(), scene, this.object3d, {
                resolution: this.resolutionState.get(),
                blur: [this.blurState.get(), this.blurState.get()],
                mixBlur: 2.5,
                mixContrast: this.contrastState.get(),
                mirror: this.mirrorState.get()
            })
            copyStandard(this.material, mat)
            this.material.dispose()
            this.material = this.object3d.material = mat

            const handle = onBeforeRender(() => {
                mat.update()
            })
            return () => {
                mat.dispose()
                handle.cancel()
            }
        }, [getRenderer, getClass, getCamera, this.resolutionState.get, this.blurState.get, this.contrastState.get, this.mirrorState.get])
    }

    private resolutionState = new Reactive(512)
    public get resolution() {
        return this.resolutionState.get()
    }
    public set resolution(val) {
        this.resolutionState.set(val)
    }

    private blurState = new Reactive(1024)
    public get blur() {
        return this.blurState.get()
    }
    public set blur(val) {
        this.blurState.set(val)
    }

    private contrastState = new Reactive(1.5)
    public get contrast() {
        return this.contrastState.get()
    }
    public set contrast(val) {
        this.contrastState.set(val)
    }

    private mirrorState = new Reactive(1)
    public get mirror() {
        return this.mirrorState.get()
    }
    public set mirror(val) {
        this.mirrorState.set(val)
    }
}