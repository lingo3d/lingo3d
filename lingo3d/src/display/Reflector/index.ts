import IReflector, {
    reflectorDefaults,
    reflectorSchema
} from "../../interface/IReflector"
import Plane from "../primitives/Plane"
import { Reactive } from "@lincode/reactivity"
import ReflectorMaterial from "./ReflectorMaterial"

export default class Reflector extends Plane implements IReflector {
    public static override componentName = "reflector"
    public static override defaults = reflectorDefaults
    public static override schema = reflectorSchema

    public constructor() {
        super()
        this.rotationX = -90
        this.opacity = 0.01

        this.createEffect(() => {
            const reflectorMaterial = new ReflectorMaterial(this.object3d, {
                clipBias: 0.003,
                textureWidth: 256,
                textureHeight: 256,
                color: this.colorState.get()
            })
            
            const handle = this.reflectivityState.get(reflectivity => {
                reflectorMaterial.uniforms["opacity"].value = reflectivity
            })
            
            //@ts-ignore
            this.object3d.material.dispose()
            this.object3d.material = reflectorMaterial
            //@ts-ignore
            this.object3d.onBeforeRender = reflectorMaterial.render

            return () => {
                reflectorMaterial.dispose()
                handle.cancel()
            }
        }, [this.colorState.get])
    }

    private reflectivityState = new Reactive(1)
    public get reflectivity() {
        return this.reflectivityState.get()
    }
    public set reflectivity(value) {
        this.reflectivityState.set(value)
    }
    
    private colorState = new Reactive("#777777")
    public override get color() {
        return this.colorState.get()
    }
    public override set color(value: string) {
        this.colorState.set(value)
        super.color = value
    }
}
