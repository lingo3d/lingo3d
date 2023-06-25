import { createEffect } from "@lincode/reactivity"
import { lazy } from "@lincode/utils"
import { EffectComposer, EffectPass, RenderPass } from "postprocessing"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { getRenderer } from "../../../states/useRenderer"
import { getResolution } from "../../../states/useResolution"
import scene from "../../scene"
import { getBloomEffect } from "./bloomEffect"
import { getBokehEffect } from "./bokehEffect"
import { getOutlineEffect } from "./outlineEffect"
import { getSelectiveBloomEffect } from "./selectiveBloomEffect"
import { getSSREffect } from "./ssrEffect"
import { getVignetteEffect } from "./vignetteEffect"
import { cameraRenderedPtr } from "../../../pointers/cameraRenderedPtr"
import { resolutionPtr } from "../../../pointers/resolutionPtr"
import { getSSAO } from "../../../states/useSSAO"
//@ts-ignore
import { N8AOPostPass } from "n8ao"
import { Cancellable } from "@lincode/promiselikes"
import { getPixelRatio } from "../../../states/usePixelRatio"

const effectComposer = new EffectComposer(undefined, { multisampling: 4 })
getRenderer((renderer) => renderer && effectComposer.setRenderer(renderer))
export default effectComposer

createEffect(() => {
    const renderPass = new RenderPass(scene, cameraRenderedPtr[0])
    effectComposer.addPass(renderPass, 0)
    return () => {
        effectComposer.removePass(renderPass)
        renderPass.dispose()
    }
}, [getCameraRendered])

const lazyAOPass = lazy(() => {
    const pass = new N8AOPostPass(scene, cameraRenderedPtr[0], 128, 128)
    pass.configuration.aoRadius = 1
    pass.configuration.intensity = 2
    return pass
})

createEffect(() => {
    const [[w, h]] = resolutionPtr
    effectComposer.setSize(w, h)

    const handle = new Cancellable()
    if (getSSAO()) {
        const n8aopass = lazyAOPass()
        effectComposer.addPass(n8aopass)
        handle.then(() => effectComposer.removePass(n8aopass))
    }
    const effectPass = new EffectPass(
        cameraRenderedPtr[0],
        ...[
            getBloomEffect(),
            getSelectiveBloomEffect(),
            getSSREffect(),
            getOutlineEffect(),
            getBokehEffect(),
            getVignetteEffect()
        ].filter(Boolean)
    )
    effectComposer.addPass(effectPass)

    return () => {
        handle.cancel()
        effectComposer.removePass(effectPass)
        effectPass.dispose()
    }
}, [
    getCameraRendered,
    getRenderer,
    getResolution,
    getPixelRatio,
    getSSAO,
    getBloomEffect,
    getSelectiveBloomEffect,
    getSSREffect,
    getOutlineEffect,
    getBokehEffect,
    getVignetteEffect
])
