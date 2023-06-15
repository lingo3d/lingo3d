import { createEffect } from "@lincode/reactivity"
import { filterBoolean, lazy } from "@lincode/utils"
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
import { emitRenderAO } from "../../../events/onRenderAO"

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

createEffect(() => {
    const [[w, h]] = resolutionPtr
    effectComposer.setSize(w, h)
}, [getRenderer, getResolution])

const lazyAOPass = lazy(() => {
    const pass = new N8AOPostPass(scene, cameraRenderedPtr[0], 128, 128)
    const { render } = pass
    pass.render = function (...args: Array<any>) {
        emitRenderAO("before")
        render.apply(this, args)
        emitRenderAO("after")
    }
    return pass
})

createEffect(() => {
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
        ].filter(filterBoolean)
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
    getSSAO,
    getBloomEffect,
    getSelectiveBloomEffect,
    getSSREffect,
    getOutlineEffect,
    getBokehEffect,
    getVignetteEffect
])
