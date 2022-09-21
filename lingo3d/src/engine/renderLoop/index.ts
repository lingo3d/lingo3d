import { createEffect } from "@lincode/reactivity"
import { emitAfterRender } from "../../events/onAfterRender"
import { emitBeforeRender } from "../../events/onBeforeRender"
import { setOutline } from "../../states/useOutline"
import { getRenderer } from "../../states/useRenderer"
import { getResolution } from "../../states/useResolution"
import { getSecondaryCamera } from "../../states/useSecondaryCamera"
import { setSelectiveBloom } from "../../states/useSelectiveBloom"
import { getWebXR } from "../../states/useWebXR"
import { loop } from "../eventLoop"
import scene from "../scene"
import { outlinePtr } from "./effectComposer/outlinePass"
import renderSelectiveBloom, {
    bloomPtr
} from "./effectComposer/selectiveBloomPass/renderSelectiveBloom"
import "./resize"
import "./effectComposer"
import { getEffectComposer } from "../../states/useEffectComposer"
import { getCameraRendered } from "../../states/useCameraRendered"
import { emitRender } from "../../events/onRender"

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    const camera = getCameraRendered()
    const secondaryCamera = getSecondaryCamera()

    if (secondaryCamera) {
        const [resX, resY] = getResolution()
        const width = resX * 1
        const height = resY * 0.5

        secondaryCamera.aspect = camera.aspect = width / height
        camera.updateProjectionMatrix()
        secondaryCamera.updateProjectionMatrix()

        const handle = loop(() => {
            emitBeforeRender()
            emitRender()

            renderer.setViewport(0, 0, width, height)
            renderer.setScissor(0, 0, width, height)
            renderer.setScissorTest(true)
            renderer.render(scene, secondaryCamera)

            renderer.setViewport(0, height, width, height)
            renderer.setScissor(0, height, width, height)
            renderer.render(scene, camera)

            emitAfterRender()
        })
        return () => {
            handle.cancel()

            renderer.setViewport(0, 0, resX, resY)
            renderer.setScissor(0, 0, resX, resY)
            renderer.setScissorTest(false)

            camera.aspect = resX / resY
            camera.updateProjectionMatrix()
        }
    }

    if (getWebXR()) {
        const handle = loop(() => {
            emitBeforeRender()
            emitRender()
            renderer.render(scene, camera)
            emitAfterRender()
        })
        return () => {
            handle.cancel()
        }
    }

    const effectComposer = getEffectComposer()
    if (!effectComposer) return

    let selectiveBloomInitialized = false
    let outlineInitialized = false

    const handle = loop(() => {
        emitBeforeRender()
        emitRender()

        if (bloomPtr[0]) {
            if (!selectiveBloomInitialized) {
                setSelectiveBloom(true)
                selectiveBloomInitialized = true
            }
            renderSelectiveBloom()
        }
        if (outlinePtr[0] && !outlineInitialized) {
            setOutline(true)
            outlineInitialized = true
        }
        effectComposer.render()

        emitAfterRender()
    })
    return () => {
        handle.cancel()
    }
}, [
    getWebXR,
    getCameraRendered,
    getSecondaryCamera,
    getResolution,
    getRenderer,
    getEffectComposer
])
