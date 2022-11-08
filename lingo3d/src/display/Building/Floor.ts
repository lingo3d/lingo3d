import { Reactive } from "@lincode/reactivity"
import { range } from "@lincode/utils"
import Building from "."
import Appendable from "../../api/core/Appendable"
import { hiddenAppendables } from "../../api/core/collections"
import { FACADE_URL } from "../../globals"
import IFloor, { FacadePreset } from "../../interface/IFloor"
import VisibleObjectManager from "../core/VisibleObjectManager"
import Model from "../Model"

const makeFacade = (src: string, parent: Appendable, rotationY: number) => {
    const facade = new Model()
    facade.src = src
    facade.rotationY = rotationY
    parent.append(facade)
    return facade
}

const applyTransform = (
    facadeArray: Array<Model>,
    radius: number,
    diameter: number,
    repeatX: number,
    repeatZ: number,
    z: boolean
) => {
    const offset = diameter * facadeArray.length * 0.5 - radius

    let i = 0
    if (z) {
        for (const facade of facadeArray) {
            facade.z += radius * repeatX
            facade.x += i++ * diameter - offset
        }
        return
    }

    for (const facade of facadeArray) {
        facade.x += radius * repeatZ
        facade.z += i++ * diameter - offset
    }
}

export default class Floor extends VisibleObjectManager implements IFloor {
    public constructor(parent: Building) {
        super()

        parent.append(this)
        hiddenAppendables.add(this)

        this.createEffect(() => {
            const repeatX = Math.max(Math.floor(this.repeatXState.get()), 1)
            const repeatZ = Math.max(Math.floor(this.repeatZState.get()), 1)

            const src = FACADE_URL + this.presetState.get() + ".glb"

            const facade0 = range(repeatX).map(() => makeFacade(src, this, 0))
            const facade2 = range(repeatX).map(() => makeFacade(src, this, 180))
            const facade1 = range(repeatZ).map(() => makeFacade(src, this, 90))
            const facade3 = range(repeatZ).map(() => makeFacade(src, this, 270))

            const handle = facade0[0].loaded.then(() => {
                const diameter = facade0[0].depth
                const radius = diameter * 0.5

                applyTransform(
                    facade0,
                    radius,
                    diameter,
                    repeatX,
                    repeatZ,
                    false
                )
                applyTransform(
                    facade2,
                    -radius,
                    -diameter,
                    repeatX,
                    repeatZ,
                    false
                )
                applyTransform(
                    facade1,
                    -radius,
                    -diameter,
                    repeatX,
                    repeatZ,
                    true
                )
                applyTransform(
                    facade3,
                    radius,
                    diameter,
                    repeatX,
                    repeatZ,
                    true
                )
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
