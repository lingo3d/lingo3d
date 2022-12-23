import { YBOT_URL } from "../../globals"
import IModel, { modelDefaults, modelSchema } from "../../interface/IModel"
import Model from "../Model"

export default class Character extends Model implements IModel {
    public static override componentName = "character"
    public static override defaults = modelDefaults
    public static override schema = modelSchema

    public constructor() {
        super()
        this.width = 20
        this.depth = 20
        this.scale = 1.7

        this.src = YBOT_URL
    }
}
