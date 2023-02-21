import Appendable from "../api/core/Appendable"
import IMathNode, {
    mathNodeDefaults,
    mathNodeSchema
} from "../interface/IMathNode"

export default class MathNode extends Appendable implements IMathNode {
    public static componentName = "mathNode"
    public static defaults = mathNodeDefaults
    public static schema = mathNodeSchema
    public static includeKeys = ["expression"]

    private _expression?: string
    public get expression() {
        return this._expression
    }
    public set expression(val) {
        this._expression = val
    }

    public evaluate(scope?: Record<string, number>) {}
}
