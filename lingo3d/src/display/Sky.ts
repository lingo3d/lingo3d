import { Group } from "three"
import EventLoopItem from "../api/core/EventLoopItem"
import ISky, { skyDefaults } from "../interface/ISky"
import { setSkyShader } from "../states/useSkyShader"

export default class Sky extends EventLoopItem implements ISky {
    public static componentName = "sky"
    public static defaults = skyDefaults

    public constructor() {
        super(new Group())
        setSkyShader(true)
    }
}