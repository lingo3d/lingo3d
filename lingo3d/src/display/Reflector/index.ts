import IReflector, {
    reflectorDefaults,
    reflectorSchema
} from "../../interface/IReflector"
import Plane from "../primitives/Plane"
import { Reactive } from "@lincode/reactivity"
//@ts-ignore
import { ReflectNode, NodeFrame, ExpressionNode, PhongNodeMaterial, BlurNode, FloatNode, ColorAdjustmentNode, Vector2Node } from "three/examples/jsm/nodes/Nodes"
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
            //@ts-ignore
            this.object3d.material.dispose()
            this.object3d.material = reflectorMaterial
            //@ts-ignore
            this.object3d.onBeforeRender = reflectorMaterial.render

            return () => {
                reflectorMaterial.dispose()
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
