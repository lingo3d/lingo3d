import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import {
    BloomEffect,
    Effect,
    EffectComposer,
    EffectPass,
    RenderPass
} from "postprocessing"
import { getBloom } from "../../../states/useBloom"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { getRenderer } from "../../../states/useRenderer"
import { getResolution } from "../../../states/useResolution"
import scene from "../../scene"
import { SSREffect } from "./ssr"

const effectComposer = new EffectComposer(undefined)
export default effectComposer

getRenderer((renderer) => renderer && effectComposer.setRenderer(renderer))

createEffect(() => {
    if (!getRenderer()) return

    const [w, h] = getResolution()
    effectComposer.setSize(w, h)
}, [getRenderer, getResolution])

createEffect(() => {
    if (!getRenderer()) return

    const camera = getCameraRendered()
    const handle = new Cancellable()

    const renderPass = new RenderPass(scene, camera)
    effectComposer.addPass(renderPass)

    const effects: Array<Effect> = []

    if (getBloom()) {
        const bloomEffect = new BloomEffect()
        effects.push(bloomEffect)
        handle.then(() => {
            bloomEffect.dispose()
        })
    }

    const ssrEffect = new SSREffect(scene, camera)
    effects.push(ssrEffect)
    handle.then(() => {
        ssrEffect.dispose()
    })

    const effectPass = new EffectPass(camera, ...effects)
    effectComposer.addPass(effectPass)

    return () => {
        effectComposer.removeAllPasses()
        renderPass.dispose()
        effectPass.dispose()
        handle.cancel()
    }
}, [getCameraRendered, getRenderer, getBloom])
