import { createEffect } from "@lincode/reactivity"
import { emitAfterRender } from "../../events/onAfterRender"
import { emitBeforeRender } from "../../events/onBeforeRender"
import { getRenderer } from "../../states/useRenderer"
import { getResolution } from "../../states/useResolution"
import { getSecondaryCamera } from "../../states/useSecondaryCamera"
import { getWebXR } from "../../states/useWebXR"
import { dt, loop } from "../eventLoop"
import scene from "../scene"
import "./resize"
import { getCameraRendered } from "../../states/useCameraRendered"
import { emitRender } from "../../events/onRender"
import effectComposer from "./effectComposer"

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

    const handle = loop(() => {
        emitBeforeRender()
        emitRender()
        effectComposer.render(dt[0])
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
    getRenderer
])
