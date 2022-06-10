import { Reactive } from "@lincode/reactivity"
import { Group } from "three"
import Appendable from "../api/core/Appendable"
import ObjectManager from "./core/ObjectManager"
import Model from "./Model"

const url = "https://unpkg.com/lingo3d-facade@1.0.0/assets/"

type FacadeName = "city0" | "city1" | "ghetto0" | "ghetto1" | "ghetto2" | "industrial0" | "storefront0"

const makeFacade = (src: string, parent: Appendable, rotationY: number) => {
    const facade = new Model()
    facade.src = src
    facade.rotationY = rotationY
    parent.append(facade)
    return facade
}

export default class Facade extends ObjectManager<Group> {
    public constructor() {
        const group = new Group()
        super(group)

        this.createEffect(() => {
            const src = url + this.presetState.get() + ".glb"
            const facade0 = makeFacade(src, this, 0)
            const facade1 = makeFacade(src, this, 90)
            const facade2 = makeFacade(src, this, 180)
            const facade3 = makeFacade(src, this, 270)

        }, [this.presetState.get])
    }
    
    private presetState = new Reactive<FacadeName>("industrial0")
    public get preset() {
        return this.presetState.get()
    }
    public set preset(val) {
        this.presetState.set(val)
    }
}