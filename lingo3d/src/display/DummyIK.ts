import Appendable from "../api/core/Appendable"
import IDummyIK, { dummyIKDefaults, dummyIKSchema } from "../interface/IDummyIK"

//@ts-ignore
export default class DummyIK extends Appendable implements IDummyIK {
    public static componentName = "dummyIK"
    public static defaults = dummyIKDefaults
    public static schema = dummyIKSchema
}
