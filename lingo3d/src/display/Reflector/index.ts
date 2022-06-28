import IReflector, { reflectorDefaults, reflectorSchema } from "../../interface/IReflector"
import Plane from "../primitives/Plane"

export default class Reflector extends Plane implements IReflector {
    public static override componentName = "reflector"
    public static override defaults = reflectorDefaults
    public static override schema = reflectorSchema

    public constructor() {
        super()
        this.rotationX = -90

        // this.reflection = true
        this.opacity = 0.01
    }
}