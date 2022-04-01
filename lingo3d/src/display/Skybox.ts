import { Group } from "three"
import { setBackgroundSkybox } from "../states/useBackgroundSkybox"
import ISkybox, { skyboxDefaults } from "../interface/ISkybox"
import EventLoopItem from "../api/core/EventLoopItem"

let activeSkybox: Skybox | undefined

export default class Skybox extends EventLoopItem implements ISkybox {
    public static componentName = "skybox"
    public static defaults = skyboxDefaults

    public outerObject3d = new Group()

    public constructor() {
        super()
        this.initOuterObject3d()
        activeSkybox = this
        this.then(() => activeSkybox === this && setBackgroundSkybox(undefined))
    }

    private _texture?: string | Array<string>
    public get texture() {
        return this._texture
    }
    public set texture(value: string | Array<string> | undefined) {
        this._texture = value
        activeSkybox === this && setBackgroundSkybox(value)
    }
}