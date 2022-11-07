import { BufferGeometry } from "three"
import { hiddenAppendables } from "../../../api/core/Appendable"
import {
    positionedDefaults,
    positionedSchema
} from "../../../interface/IPositioned"
import Primitive from "../Primitive"

//@ts-ignore
export default abstract class HelperPrimitive extends Primitive {
    public static componentName = "helper"
    public static override defaults = positionedDefaults
    public static override schema = positionedSchema

    public constructor(geometry: BufferGeometry) {
        super(geometry)
        hiddenAppendables.add(this)
        this.opacity = 0.5
        this.castShadow = false
        this.receiveShadow = false
    }
}
