import IWater, { waterDefaults, waterSchema } from "../interface/IWater"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import { excludeSSRSet } from "../collections/excludeSSRSet"
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
        excludeSSRSet.add(this.outerObject3d)
        this.rotationX = 270
        this.object3d.scale.z = Number.EPSILON
        configWaterSystem.add(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        excludeSSRSet.delete(this.outerObject3d)
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
