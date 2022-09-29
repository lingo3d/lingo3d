import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import {
    BloomEffect,
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

    if (getBloom()) {
        const bloomEffect = new BloomEffect()
        const bloomPass = new EffectPass(camera, bloomEffect)
        effectComposer.addPass(bloomPass)
        handle.then(() => {
            bloomEffect.dispose()
            bloomPass.dispose()
        })
    }

    const ssrEffect = new SSREffect(scene, camera)
    const ssrPass = new EffectPass(camera, ssrEffect)
    effectComposer.addPass(ssrPass)
    handle.then(() => {
        ssrEffect.dispose()
        ssrPass.dispose()
    })

    return () => {
        effectComposer.removeAllPasses()
        renderPass.dispose()
        handle.cancel()
    }
}, [getCameraRendered, getRenderer, getBloom])
