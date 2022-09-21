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
import loadTexture from "../display/utils/loaders/loadTexture"
import { onBeforeRender } from "../events/onBeforeRender"
import { FAR, NEAR, TEXTURES_URL } from "../globals"
import { getCentripetal } from "../states/useCentripetal"
import { getDefaultLight } from "../states/useDefaultLight"
import { getEnvironmentStack } from "../states/useEnvironmentStack"
import { getRenderer } from "../states/useRenderer"
import scene from "./scene"

const defaultEnvironment = new Environment()
defaultEnvironment.texture = undefined
appendableRoot.delete(defaultEnvironment)
defaultEnvironment.helper = false

const cubeRenderTarget = new WebGLCubeRenderTarget(256)
const cubeCamera = new CubeCamera(NEAR, FAR, cubeRenderTarget)

createEffect(() => {
    const environment = last(getEnvironmentStack())
    const renderer = getRenderer()

    if (!environment?.texture || !renderer) return

    if (environment.texture === "dynamic") {
        const handle = onBeforeRender(() => {
            cubeCamera.position.copy(environment.outerObject3d.position)
            cubeCamera.matrixWorld.copy(environment.outerObject3d.matrixWorld)
            cubeCamera.update(renderer, scene)
        })

        scene.environment = cubeRenderTarget.texture

        return () => {
            handle.cancel()
            scene.environment = null
        }
    }
    let proceed = true
    const texture = loadTexture(
        environment.texture === "studio"
            ? TEXTURES_URL + "studio.jpg"
            : environment.texture,
        () => proceed && (scene.environment = texture)
    )
    texture.mapping = EquirectangularReflectionMapping

    return () => {
        proceed = false
        scene.environment = null
    }
}, [getEnvironmentStack, getRenderer])

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
        light.y = FAR
        light.z = FAR
        light.intensity = 0.5
        handle.then(() => light.dispose())

        if (!getCentripetal()) return

        const light2 = new DirectionalLight()
        appendableRoot.delete(light2)
        light2.helper = false
        light2.y = -FAR
        light2.z = -FAR
        light2.intensity = 0.5
        handle.then(() => light2.dispose())
    })

    return () => {
        handle.cancel()
    }
}, [getDefaultLight, getCentripetal])
