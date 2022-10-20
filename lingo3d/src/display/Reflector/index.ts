import { Reactive } from "@lincode/reactivity"
import { Mesh } from "three"
import { ssrExcludeSet } from "../../engine/renderLoop/effectComposer/ssrEffect/renderSetup"
import scene from "../../engine/scene"
import { onRender } from "../../events/onRender"
import IReflector, {
    reflectorDefaults,
    reflectorSchema
} from "../../interface/IReflector"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getRenderer } from "../../states/useRenderer"
import VisibleObjectManager from "../core/VisibleObjectManager"
import { planeGeometry } from "../primitives/Plane"

export default class Reflector
    extends VisibleObjectManager
    implements IReflector
{
    public static componentName = "reflector"
    public static defaults = reflectorDefaults
    public static schema = reflectorSchema

    public constructor() {
        const mesh = new Mesh(planeGeometry)
        mesh.castShadow = true
        mesh.receiveShadow = true

        super(mesh)
        this.rotationX = 270

        ssrExcludeSet.add(this.outerObject3d)
        this.then(() => ssrExcludeSet.delete(this.outerObject3d))

        import("./MeshReflectorMaterial").then(
            ({ default: MeshReflectorMaterial }) => {
                this.createEffect(() => {
                    const renderer = getRenderer()
                    if (!renderer || this.done) return

                    const camera = getCameraRendered()
                    const mat = (mesh.material = new MeshReflectorMaterial(
                        renderer,
                        camera,
                        scene,
                        this.object3d,
                        {
                            resolution: this.resolutionState.get(),
                            blur: [this.blurState.get(), this.blurState.get()],
                            mixBlur: 2.5,
                            mixContrast: this.contrastState.get(),
                            mirror: this.mirrorState.get(),
                            distortionMap: undefined
                        }
                    ))
                    const handle = onRender(() => {
                        camera.updateWorldMatrix(true, false)
                        mat.update()
                    })
                    return () => {
                        mat.dispose()
                        handle.cancel()
                    }
                }, [
                    getRenderer,
                    getCameraRendered,
                    this.resolutionState.get,
                    this.blurState.get,
                    this.contrastState.get,
                    this.mirrorState.get
                ])
            }
        )
    }

    private resolutionState = new Reactive(256)
    public get resolution() {
        return this.resolutionState.get()
    }
    public set resolution(val) {
        this.resolutionState.set(val)
    }

    private blurState = new Reactive(512)
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
