import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { Effect, EffectComposer, EffectPass, RenderPass } from "postprocessing"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { getRenderer } from "../../../states/useRenderer"
import { getResolution } from "../../../states/useResolution"
import { getSSR } from "../../../states/useSSR"
import { getSSRIntensity } from "../../../states/useSSRIntensity"
import scene from "../../scene"
import { getBloomEffect } from "./bloomEffect"
import { SSREffect } from "./ssr"

const effectComposer = new EffectComposer(undefined)
export default effectComposer

getRenderer((renderer) => renderer && effectComposer.setRenderer(renderer))

createEffect(() => {
    const renderPass = new RenderPass(scene, getCameraRendered())
    effectComposer.addPass(renderPass, 0)
    return () => {
        effectComposer.removePass(renderPass)
    }
}, [getCameraRendered])

createEffect(() => {
    if (!getRenderer()) return

    const [w, h] = getResolution()
    effectComposer.setSize(w, h)
}, [getRenderer, getResolution])

createEffect(() => {
    if (!getRenderer()) return

    const camera = getCameraRendered()
    const handle = new Cancellable()

    //@ts-ignore
    const effects: Array<Effect> = [getBloomEffect()].filter(Boolean)

    if (getSSR()) {
        const ssrEffect = new SSREffect(scene, camera)
        effects.push(ssrEffect)

        handle.watch(
            //@ts-ignore
            getSSRIntensity((intensity) => (ssrEffect.intensity = intensity))
        )
        handle.then(() => {
            ssrEffect.dispose()
        })
    }

    const effectPass = new EffectPass(camera, ...effects)
    effectComposer.addPass(effectPass)

    return () => {
        effectComposer.removePass(effectPass)
        effectPass.dispose()
        handle.cancel()
    }
}, [getCameraRendered, getRenderer, getBloomEffect, getSSR])
