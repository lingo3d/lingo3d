import { Reactive } from "@lincode/reactivity"
import { range } from "@lincode/utils"
import { Group } from "three"
import IBuilding, { buildingDefaults, buildingSchema } from "../../interface/IBuilding"
import { FacadePreset } from "../../interface/IFloor"
import ObjectManager from "../core/ObjectManager"
import Floor from "./Floor"

export default class Building extends ObjectManager<Group> implements IBuilding {
    public static componentName = "building"
    public static defaults = buildingDefaults
    public static schema = buildingSchema

    public constructor() {
        const group = new Group()
        super(group)

        this.scale = 10

        this.createEffect(() => {
            const preset = this.presetState.get()
            const repeatX = this.repeatXState.get()
            const repeatZ = this.repeatZState.get()
            const repeatY = Math.max(Math.floor(this.repeatYState.get()), 1)

            const floors = range(repeatY).map(y => {
                const floor = new Floor(this)
                floor.preset = preset
                floor.repeatX = repeatX
                floor.repeatZ = repeatZ
                floor.y = y * 100

                return floor
            })

            return () => {
                for (const floor of floors)
                    floor.dispose()
            }
        }, [this.presetState.get, this.repeatXState.get, this.repeatZState.get, this.repeatYState.get])
    }
    
    private presetState = new Reactive<FacadePreset>("industrial0")
    public get preset() {
        return this.presetState.get()
    }
    public set preset(val) {
        this.presetState.set(val)
    }

    private repeatXState = new Reactive(1)
    public get repeatX() {
        return this.repeatXState.get()
    }
    public set repeatX(val) {
        this.repeatXState.set(val)
    }

    private repeatZState = new Reactive(1)
    public get repeatZ() {
        return this.repeatZState.get()
    }
    public set repeatZ(val) {
        this.repeatZState.set(val)
    }

    private repeatYState = new Reactive(1)
    public get repeatY() {
        return this.repeatYState.get()
    }
    public set repeatY(val) {
        this.repeatYState.set(val)
    }
}