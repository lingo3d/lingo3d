import IWater, { waterDefaults, waterSchema } from "../interface/IWater"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import { ssrExcludeSet } from "../collections/ssrExcludeSet"
import type { Water as ThreeWater } from "three/examples/jsm/objects/Water"
import { configWaterSystem } from "../systems/configSystems/configWaterSystem"

export default class Water extends PhysicsObjectManager implements IWater {
    public static componentName = "water"
    public static defaults = waterDefaults
    public static schema = waterSchema

    public $water?: ThreeWater

    private _shape: "plane" | "sphere" = "plane"
    public get shape() {
        return this._shape
    }
    public set shape(val) {
        this._shape = val
        configWaterSystem.add(this)
    }

    private _normalMap: string | undefined
    public get normalMap() {
        return this._normalMap
    }
    public set normalMap(val) {
        this._normalMap = val
        configWaterSystem.add(this)
    }

    private _resolution = 512
    public get resolution() {
        return this._resolution
    }
    public set resolution(val) {
        this._resolution = val
        configWaterSystem.add(this)
    }

    public speed = 1

    public constructor() {
        super()
        ssrExcludeSet.add(this.$object)
        this.rotationX = 270
        this.$innerObject.scale.z = Number.EPSILON
        configWaterSystem.add(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        ssrExcludeSet.delete(this.$object)
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}
}
