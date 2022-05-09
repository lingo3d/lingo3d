import { createEffect } from "@lincode/reactivity"
import { preventTreeShake } from "@lincode/utils"
import SimpleObjectManager from "../../display/core/SimpleObjectManager"
import Cube from "../../display/primitives/Cube"
import { vector3 } from "../../display/utils/reusables"
import { emitAfterRender } from "../../events/onAfterRender"
import { emitBeforeRender } from "../../events/onBeforeRender"
import { getCamera } from "../../states/useCamera"
import { setOutline } from "../../states/useOutline"
import { getPerformance } from "../../states/usePerformance"
import { getRenderer } from "../../states/useRenderer"
import { getResolution } from "../../states/useResolution"
import { getSecondaryCamera } from "../../states/useSecondaryCamera"
import { setSelectiveBloom } from "../../states/useSelectiveBloom"
import { setSSR } from "../../states/useSSR"
import { getVR } from "../../states/useVR"
import { loop } from "../eventLoop"
import scene from "../scene"
import effectComposer from "./effectComposer"
import { outlinePtr } from "./effectComposer/outlinePass"
import renderSelectiveBloom, { bloomPtr } from "./effectComposer/selectiveBloomPass/renderSelectiveBloom"
import { ssrPtr } from "./effectComposer/ssrPass"
import resize from "./resize"

preventTreeShake(resize)

export default {}

createEffect(() => {
    const vr = getVR()
    const camera = getCamera()
    const secondaryCamera = getSecondaryCamera()
    const renderer = getRenderer()

    if (secondaryCamera) {
        const [resX, resY] = getResolution()
        const width = resX * 1
        const height = resY * 0.5

        secondaryCamera.aspect = camera.aspect = width / height
        camera.updateProjectionMatrix()
        secondaryCamera.updateProjectionMatrix()

        const handle = loop(() => {
            emitBeforeRender()

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
    
    if (getPerformance() === "speed" || vr === "webxr") {
        const handle = loop(() => {
            emitBeforeRender()
            renderer.render(scene, camera)
            emitAfterRender()
        })
        return () => {
            handle.cancel()
        }
    }

    if (vr) {
        const focus = new Cube()
        focus.scale = 0.5
        focus.visible = false

        const focalDistannce = 1000
        const parallax = -focalDistannce * 0.5

        const [resX, resY] = getResolution()
        const width = resX * 0.5
        const height = resY * 1

        camera.aspect = width / height
        camera.updateProjectionMatrix()

        const camManager = new SimpleObjectManager(camera)

        const handle = loop(() => {
            emitBeforeRender()

            renderer.setViewport(0, 0, width, height)
            renderer.setScissor(0, 0, width, height)
            renderer.setScissorTest(true)

            focus.outerObject3d.position.copy(camera.getWorldPosition(vector3))
            focus.outerObject3d.quaternion.copy(camera.quaternion)
            focus.translateZ(-focalDistannce)

            const focalPosition = focus.outerObject3d.position.clone()
            const quat = camera.quaternion.clone()
            const pos = camera.position.clone()

            focus.moveRight(parallax)
            camManager.moveRight(-3)
            camera.lookAt(focus.outerObject3d.position)
            renderer.render(scene, camera)
            
            focus.outerObject3d.position.copy(focalPosition)
            camera.quaternion.copy(quat)
            camera.position.copy(pos)

            renderer.setViewport(width, 0, width, height)
            renderer.setScissor(width, 0, width, height)

            focus.moveRight(-parallax)
            camManager.moveRight(3)
            camera.lookAt(focus.outerObject3d.position)
            renderer.render(scene, camera)

            focus.outerObject3d.position.copy(focalPosition)
            camera.quaternion.copy(quat)
            camera.position.copy(pos)

            emitAfterRender()
        })
        return () => {
            focus.dispose()
            handle.cancel()

            renderer.setViewport(0, 0, resX, resY)
            renderer.setScissor(0, 0, resX, resY)
            renderer.setScissorTest(false)

            camera.aspect = resX / resY
            camera.updateProjectionMatrix()
        }
    }

    let selectiveBloomInitialized = false
    let ssrInitialized = false
    let outlineInitialized = false

    const handle = loop(() => {
        emitBeforeRender()

        if (bloomPtr[0]) {
            if (!selectiveBloomInitialized) {
                setSelectiveBloom(true)
                selectiveBloomInitialized = true
            }
            renderSelectiveBloom()
        }
        if (ssrPtr[0] && !ssrInitialized) {
            setSSR(true)
            ssrInitialized = true
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
}, [getPerformance, getVR, getCamera, getSecondaryCamera, getResolution, getRenderer])