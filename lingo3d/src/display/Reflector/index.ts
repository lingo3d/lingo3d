import IReflector, {
    reflectorDefaults,
    reflectorSchema
} from "../../interface/IReflector"
import Plane from "../primitives/Plane"
import { Reflector as ThreeReflector } from "three/examples/jsm/objects/Reflector"
import { Reactive } from "@lincode/reactivity"

export default class Reflector extends Plane implements IReflector {
    public static override componentName = "reflector"
    public static override defaults = reflectorDefaults
    public static override schema = reflectorSchema

    public constructor() {
        super()
        this.rotationX = -90
        this.opacity = 0.01

        this.createEffect(() => {
            const reflector = new ThreeReflector(this.object3d.geometry, {
                clipBias: 0.003,
                textureWidth: 128,
                textureHeight: 128,
                color: this.colorState.get()
            })
            this.object3d.add(reflector)

            return () => {
                reflector.dispose()
                this.object3d.remove(reflector)
            }
        }, [this.colorState.get])
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
