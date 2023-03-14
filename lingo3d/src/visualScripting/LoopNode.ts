import { loopNodeDefaults, loopNodeSchema } from "../interface/ILoopNode"
import GameGraphChild from "./GameGraphChild"

export default class LoopNode extends GameGraphChild {
    public static componentName = "loopNode"
    public static defaults = loopNodeDefaults
    public static schema = loopNodeSchema
    public static includeKeys = ["onLoop"]
}
