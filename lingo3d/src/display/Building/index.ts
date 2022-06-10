import { Reactive } from "@lincode/reactivity"
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

        this.scale = 4

        this.createEffect(() => {
            const preset = this.presetState.get()
            const repeatX = this.repeatXState.get()
            const repeatZ = this.repeatZState.get()

            const floor = new Floor()
            this.append(floor)

            floor.preset = preset
            floor.repeatX = repeatX
            floor.repeatZ = repeatZ

            return () => {
                floor.dispose()
            }
        }, [this.presetState.get, this.repeatXState.get, this.repeatZState.get])
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
}