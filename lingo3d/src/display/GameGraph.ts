import Appendable from "../api/core/Appendable"
import { gameGraphDefaults, gameGraphSchema } from "../interface/IGameGraph"

export default class GameGraph extends Appendable {
    public static componentName = "gameGraph"
    public static defaults = gameGraphDefaults
    public static schema = gameGraphSchema

    public constructor() {
        super()
    }
}
