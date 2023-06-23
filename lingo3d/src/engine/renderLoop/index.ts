import { createEffect } from "@lincode/reactivity"
import { emitAfterRender } from "../../events/onAfterRender"
import { emitBeforeRender } from "../../events/onBeforeRender"
import { getRenderer } from "../../states/useRenderer"
import { getResolution } from "../../states/useResolution"
import { getWebXR } from "../../states/useWebXR"
import { loop } from "../eventLoop"
import scene from "../scene"
import { getCameraRendered } from "../../states/useCameraRendered"
import { emitRender } from "../../events/onRender"
import effectComposer from "./effectComposer"
import { getSplitView } from "../../states/useSplitView"
import { getCameraComputed } from "../../states/useCameraComputed"
import { emitPhysics } from "../../events/onPhysics"
import { emitLoop } from "../../events/onLoop"
import { cameraRenderedPtr } from "../../pointers/cameraRenderedPtr"
import { dtPtr } from "../../pointers/dtPtr"
import { rendererPtr } from "../../pointers/rendererPtr"
import { resolutionPtr } from "../../pointers/resolutionPtr"
import { emitBeforePhysics } from "../../events/onBeforePhysics"

createEffect(() => {
    const [renderer] = rendererPtr
    const [camera] = cameraRenderedPtr

    if (getSplitView()) {
        const [[resX, resY]] = resolutionPtr
        const width = resX * 1
        const height = resY * 0.5

        const secondaryCamera = getCameraComputed()
        secondaryCamera.aspect = camera.aspect = width / height
        camera.updateProjectionMatrix()
        secondaryCamera.updateProjectionMatrix()

        const handle = loop(() => {
            emitBeforePhysics()
            emitPhysics()
            emitBeforeRender()
            emitRender()
            emitLoop()

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
            emitBeforePhysics()
            emitPhysics()
            emitBeforeRender()
            emitRender()
            emitLoop()
            renderer.render(scene, camera)
            emitAfterRender()
        })
        return () => {
            handle.cancel()
        }
    }

    const handle = loop(() => {
        emitBeforePhysics()
        emitPhysics()
        emitBeforeRender()
        emitRender()
        emitLoop()
        effectComposer.render(dtPtr[0])
        emitAfterRender()
    })
    return () => {
        handle.cancel()
    }
}, [
    getWebXR,
    getCameraRendered,
    getCameraComputed,
    getSplitView,
    getResolution,
    getRenderer
])
