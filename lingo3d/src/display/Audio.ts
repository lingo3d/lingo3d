import { Group } from "three"
import PositionedItem from "../api/core/PositionedItem"
import IAudio, { audioDefaults, audioSchema } from "../interface/IAudio"

export default class Audio extends PositionedItem implements IAudio {
    public static componentName = "audio"
    public static defaults = audioDefaults
    public static schema = audioSchema

    public constructor() {
        super(new Group())
    }
}