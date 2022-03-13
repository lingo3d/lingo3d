import { Group } from "three"
import { getBackgroundSkybox, setBackgroundSkybox } from "../states/useBackgroundSkybox"
import ISkybox from "../interface/ISkybox"
import EventLoopItem from "../api/core/EventLoopItem"

export default class Skybox extends EventLoopItem implements ISkybox {
    public outerObject3d = new Group()

    public constructor() {
        super()
        this.initOuterObject3d()
        this.then(() => this.texture = undefined)
    }

    public get texture() {
        return getBackgroundSkybox()
    }
    public set texture(value: string | Array<string> | undefined) {
        setBackgroundSkybox(value)
    }
}