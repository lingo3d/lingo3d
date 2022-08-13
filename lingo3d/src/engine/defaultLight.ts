import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { last } from "@lincode/utils"
import {
    EquirectangularReflectionMapping,
    WebGLCubeRenderTarget,
    CubeCamera
} from "three"
import { appendableRoot } from "../api/core/Appendable"
import Environment from "../display/Environment"
import getWorldPosition from "../display/utils/getWorldPosition"
import loadTexture from "../display/utils/loaders/loadTexture"
import { onBeforeRender } from "../events/onBeforeRender"
import { TEXTURES_URL } from "../globals"
import { getCameraRendered } from "../states/useCameraRendered"
import { getCentripetal } from "../states/useCentripetal"
import { getDefaultLight } from "../states/useDefaultLight"
import { getEnvironmentStack } from "../states/useEnvironmentStack"
import { getRenderer } from "../states/useRenderer"
import { camFar } from "./constants"
import scene from "./scene"

export default {}

const defaultEnvironment = new Environment()
appendableRoot.delete(defaultEnvironment)

const cubeRenderTarget = new WebGLCubeRenderTarget(256)
const cubeCamera = new CubeCamera(1, 100000, cubeRenderTarget)

createEffect(() => {
    const environment = last(getEnvironmentStack())?.texture
    if (!environment) return

    if (environment === "dynamic") {
        const handle = onBeforeRender(() => {
            const camera = getCameraRendered()
            const renderer = getRenderer()!

            cubeCamera.position.copy(getWorldPosition(camera))
            cubeCamera.matrixWorld.copy(camera.matrixWorld)

            cubeCamera.update(renderer, scene)
            renderer.render(scene, camera)
        })

        scene.environment = cubeRenderTarget.texture

        return () => {
            handle.cancel()
            scene.environment = null
        }
    }
    let proceed = true
    const texture = loadTexture(
        environment === "studio" ? TEXTURES_URL + "studio.jpg" : environment,
        () => proceed && (scene.environment = texture)
    )
    texture.mapping = EquirectangularReflectionMapping

    return () => {
        proceed = false
        scene.environment = null
    }
}, [getEnvironmentStack])

createEffect(() => {
    const defaultLight = getDefaultLight()
    if (!defaultLight) return

    if (typeof defaultLight === "string" && defaultLight !== "default") {
        if (defaultLight === "dynamic") defaultEnvironment.texture = "dynamic"
        else defaultEnvironment.texture = defaultLight

        return () => {
            defaultEnvironment.texture = undefined
        }
    }

    const handle = new Cancellable()

    import("../display/lights/SkyLight").then((module) => {
        const SkyLight = module.default
        const light = new SkyLight()
        appendableRoot.delete(light)
        light.helper = false
        light.groundColor = "#666666"
        handle.then(() => light.dispose())
    })
    import("../display/lights/DirectionalLight").then((module) => {
        const DirectionalLight = module.default
        const light = new DirectionalLight()
        appendableRoot.delete(light)
        light.helper = false
        light.y = camFar
        light.z = camFar
        light.intensity = 0.5
        handle.then(() => light.dispose())

        if (!getCentripetal()) return

        const light2 = new DirectionalLight()
        appendableRoot.delete(light2)
        light2.helper = false
        light2.y = -camFar
        light2.z = -camFar
        light2.intensity = 0.5
        handle.then(() => light2.dispose())
    })

    return () => {
        handle.cancel()
    }
}, [getDefaultLight, getCentripetal])
