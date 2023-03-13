import INumberNode, {
    numberNodeDefaults,
    numberNodeSchema
} from "../interface/INumberNode"
import GameGraphChild from "./GameGraphChild"

export default class NumberNode extends GameGraphChild implements INumberNode {
    public static componentName = "numberNode"
    public static defaults = numberNodeDefaults
    public static schema = numberNodeSchema
    public static includeKeys = ["value"]

    public value = 0
}
