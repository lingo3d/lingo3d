import { Reactive } from "@lincode/reactivity"
import { range } from "@lincode/utils"
import { Group } from "three"
import Appendable from "../api/core/Appendable"
import IBuilding, { buildingDefaults, buildingSchema, FacadePreset } from "../interface/IBuilding"
import ObjectManager from "./core/ObjectManager"
import Model from "./Model"

const url = "https://unpkg.com/lingo3d-facade@1.0.0/assets/"


const makeFacade = (src: string, parent: Appendable, rotationY: number) => {
    const facade = new Model()
    facade.src = src
    facade.rotationY = rotationY
    parent.append(facade)
    return facade
}

const applyRepeat = (facadeArray: Array<Model>, radius: number, diameter: number, z?: boolean) => {
    const offset = diameter * facadeArray.length * 0.5 - radius

    let i = 0
    if (z) {
        for (const facade of facadeArray) {
            facade.z += radius
            facade.x += (i++) * diameter - offset
        }
        return
    }
    
    for (const facade of facadeArray) {
        facade.x += radius
        facade.z += (i++) * diameter - offset
    }
}

export default class Building extends ObjectManager<Group> implements IBuilding {
    public static componentName = "building"
    public static defaults = buildingDefaults
    public static schema = buildingSchema

    public constructor() {
        const group = new Group()
        super(group)

        this.scale = 4

        this.createEffect(() => {
            const repeatX = this.repeatXState.get()
            const repeatZ = this.repeatZState.get()

            const src = url + this.presetState.get() + ".glb"
            const facade0 = range(repeatX).map(() => makeFacade(src, this, 0))
            const facade2 = range(repeatX).map(() => makeFacade(src, this, 180))

            const facade1 = range(repeatZ).map(() => makeFacade(src, this, 90))
            const facade3 = range(repeatZ).map(() => makeFacade(src, this, 270))

            const handle = facade0[0].loaded.then(() => {
                const diameter = facade0[0].depth
                const radius = diameter * 0.5

                applyRepeat(facade0, radius, diameter)
                applyRepeat(facade2, -radius, -diameter)
                applyRepeat(facade1, -radius, -diameter, true)
                applyRepeat(facade3, radius, diameter, true)
            })
            return () => {
                handle.cancel()

                for (const facade of facade0) facade.dispose()
                for (const facade of facade2) facade.dispose()
                for (const facade of facade1) facade.dispose()
                for (const facade of facade3) facade.dispose()
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

    private repeatXState = new Reactive(2)
    public get repeatX() {
        return this.repeatXState.get()
    }
    public set repeatX(val) {
        this.repeatXState.set(val)
    }

    private repeatZState = new Reactive(5)
    public get repeatZ() {
        return this.repeatZState.get()
    }
    public set repeatZ(val) {
        this.repeatZState.set(val)
    }
}