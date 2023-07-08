import { Reactive } from "@lincode/reactivity"
import { Mesh } from "three"
import scene from "../../engine/scene"
import IReflector, {
    reflectorDefaults,
    reflectorSchema
} from "../../interface/IReflector"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getRenderer } from "../../states/useRenderer"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import { planeGeometry } from "../primitives/Plane"
import { cameraRenderedPtr } from "../../pointers/cameraRenderedPtr"
import { rendererPtr } from "../../pointers/rendererPtr"
import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import { reflectorSystem } from "../../systems/reflectorSystem"

export default class Reflector
    extends PhysicsObjectManager<Mesh>
    implements IReflector
{
    public static componentName = "reflector"
    public static defaults = reflectorDefaults
    public static schema = reflectorSchema

    public constructor() {
        const mesh = new Mesh(planeGeometry)
        super(mesh)
        ssrExcludeSet.add(this.$object)
        this.rotationX = 270
        mesh.scale.z = Number.EPSILON

        import("./MeshReflectorMaterial").then(
            ({ default: MeshReflectorMaterial }) => {
                this.createEffect(() => {
                    if (this.done) return

                    const material = (mesh.material = new MeshReflectorMaterial(
                        rendererPtr[0],
                        cameraRenderedPtr[0],
                        scene,
                        mesh,
                        {
                            resolution: this.resolutionState.get(),
                            blur: [this.blurState.get(), this.blurState.get()],
                            mixBlur: 2.5,
                            mixContrast: this.contrastState.get(),
                            mirror: this.mirrorState.get(),
                            distortionMap: undefined
                        }
                    ))
                    reflectorSystem.add(this, { material })
                    return () => {
                        material.dispose()
                        reflectorSystem.delete(this)
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

    protected override disposeNode() {
        super.disposeNode()
        ssrExcludeSet.delete(this.$object)
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}

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
