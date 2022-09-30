import { createEffect } from "@lincode/reactivity"
import { Effect, EffectComposer, EffectPass, RenderPass } from "postprocessing"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { getRenderer } from "../../../states/useRenderer"
import { getResolution } from "../../../states/useResolution"
import scene from "../../scene"
import { getBloomEffect } from "./bloomEffect"
import { getOutlineEffect } from "./outlineEffect"
import { getSSREffect } from "./ssrEffect"

const effectComposer = new EffectComposer(undefined)
export default effectComposer

getRenderer((renderer) => renderer && effectComposer.setRenderer(renderer))

createEffect(() => {
    const renderPass = new RenderPass(scene, getCameraRendered())
    effectComposer.addPass(renderPass, 0)
    return () => {
        effectComposer.removePass(renderPass)
        renderPass.dispose()
    }
}, [getCameraRendered])

createEffect(() => {
    if (!getRenderer()) return

    const [w, h] = getResolution()
    effectComposer.setSize(w, h)
}, [getRenderer, getResolution])

createEffect(() => {
    if (!getRenderer()) return

    const effectPass = new EffectPass(
        getCameraRendered(),
        ...([getBloomEffect(), getSSREffect(), getOutlineEffect()].filter(
            Boolean
        ) as Array<Effect>)
    )
    effectComposer.addPass(effectPass)

    return () => {
        effectComposer.removePass(effectPass)
        effectPass.dispose()
    }
}, [
    getCameraRendered,
    getRenderer,
    getBloomEffect,
    getSSREffect,
    getOutlineEffect
])
