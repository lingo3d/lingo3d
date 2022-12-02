import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import { uiContainer } from "../engine/renderLoop/renderSetup"
import { TEXTURES_URL } from "../globals"
import IReticle, { reticleDefaults, reticleSchema } from "../interface/IReticle"
import createElement from "../utils/createElement"

export default class Reticle extends Appendable implements IReticle {
    public static componentName = "reticle"
    public static defaults = reticleDefaults
    public static schema = reticleSchema

    public constructor() {
        super()

        this.createEffect(() => {
            const variant = this.variantState.get()

            const imageElement = createElement(`
                <img
                  src="${TEXTURES_URL}reticle${variant}.png"
                  style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); pointer-events: none; user-select: none; width: 20px;"
                ></img>
            `)
            uiContainer.appendChild(imageElement)

            return () => {
                imageElement.remove()
            }
        }, [this.variantState.get])
    }

    private variantState = new Reactive<1 | 2 | 3 | 4>(1)
    public get variant() {
        return this.variantState.get()
    }
    public set variant(value) {
        this.variantState.set(value)
    }
}
