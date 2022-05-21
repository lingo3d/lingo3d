import { Group } from "three"
import ObjectManager from "../core/ObjectManager"
import { Reactive } from "@lincode/reactivity"
import IBoxLight, { boxLightDefaults, boxLightSchema } from "../../interface/IBoxLight"
import AreaLight from "./AreaLight"

export default class BoxLight extends ObjectManager<Group> implements IBoxLight {
    public static componentName = "boxLight"
    public static defaults = boxLightDefaults
    public static schema = boxLightSchema

    private makeLight() {
        const light = new AreaLight()
        this.append(light)
        this.watch(this.intensityState.get(val => light.intensity = val))
        this.watch(this.helperState.get(val => light.helper = val))
        this.watch(this.colorState.get(val => light.color = val))
        this.watch(this.areaState.get(val => light.scaleX = light.scaleY = val))
        return light
    }

    public constructor() {
        super(new Group())

        Object.assign(this.makeLight(), {
            width: 1000,
            height: 1000,
            innerY: 1000,
            innerRotationX: -90
        })
        Object.assign(this.makeLight(), {
            width: 1000,
            height: 1000,
            innerY: 1000,
            innerRotationX: -90,
            rotationX: 90
        })
        Object.assign(this.makeLight(), {
            width: 1000,
            height: 1000,
            innerY: 1000,
            innerRotationX: -90,
            rotationX: -90
        })
        Object.assign(this.makeLight(), {
            width: 1000,
            height: 1000,
            innerY: 1000,
            innerRotationX: -90,
            rotationZ: 90
        })
        Object.assign(this.makeLight(), {
            width: 1000,
            height: 1000,
            innerY: 1000,
            innerRotationX: -90,
            rotationZ: -90
        })
    }

    private intensityState = new Reactive(boxLightDefaults.intensity)
    public get intensity() {
        return this.intensityState.get()
    }
    public set intensity(val) {
        this.intensityState.set(val)
    }

    private helperState = new Reactive(boxLightDefaults.helper)
    public get helper() {
        return this.helperState.get()
    }
    public set helper(val) {
        this.helperState.set(val)
    }

    private colorState = new Reactive(boxLightDefaults.color)
    public get color() {
        return this.colorState.get()
    }
    public set color(val) {
        this.colorState.set(val)
    }

    private areaState = new Reactive(boxLightDefaults.area)
    public get area() {
        return this.areaState.get()
    }
    public set area(val) {
        this.areaState.set(val)
    }

    public override getCenter() {
        return this.getWorldPosition()
    }
}