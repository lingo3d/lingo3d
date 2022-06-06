import { Group } from "three"
import PositionedItem from "../api/core/PositionedItem"
import ITrigger, { triggerDefaults, triggerSchema } from "../interface/ITrigger"

export default class Audio extends PositionedItem {
    public static componentName = "audio"
    public static defaults = triggerDefaults
    public static schema = triggerSchema

    public constructor() {
        super(new Group())
    }
}