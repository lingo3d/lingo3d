import IAddNode, { addNodeDefaults, addNodeSchema } from "../interface/IAddNode"
import GameGraphChild from "./GameGraphChild"

export default class AddNode extends GameGraphChild implements IAddNode {
    public static componentName = "addNode"
    public static defaults = addNodeDefaults
    public static schema = addNodeSchema
    public static includeKeys = ["add", "value", "run"]

    public add = 1
    public value = 0

    public run() {
        this.value += this.add
    }
}
