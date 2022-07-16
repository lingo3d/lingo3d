import { createEffect } from "@lincode/reactivity"
import { last } from "@lincode/utils"
import { HemisphereLight, DirectionalLight, EquirectangularReflectionMapping, WebGLCubeRenderTarget, CubeCamera } from "three"
import { appendableRoot } from "../api/core/Appendable"
import Environment from "../display/Environment"
import getWorldPosition from "../display/utils/getWorldPosition"
import loadTexture from "../display/utils/loaders/loadTexture"
import { onBeforeRender } from "../events/onBeforeRender"
import { TEXTURES_URL } from "../globals"
import { getCameraRendered } from "../states/useCameraRendered"
import { getDefaultLight } from "../states/useDefaultLight"
import { getDefaultLightScale } from "../states/useDefaultLightScale"
import { getEnvironmentStack } from "../states/useEnvironmentStack"
import { getRenderer } from "../states/useRenderer"
import initLight from "./initLight"
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
    const texture = loadTexture(environment, () => proceed && (scene.environment = texture))
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
        if (defaultLight === "dynamic")
            defaultEnvironment.texture = "dynamic"
        else if (defaultLight === "studio")
            defaultEnvironment.texture = TEXTURES_URL + "studio.jpg"
        else
            defaultEnvironment.texture = defaultLight

        return () => {
            defaultEnvironment.texture = undefined
        }
    }

    const skylight = new HemisphereLight(0xffffff, 0x666666)
    scene.add(skylight)

    const light = initLight(new DirectionalLight(0xffffff, 0.5))
    light.position.set(0, 1, 1)
    scene.add(light)

    const handle = getDefaultLightScale(scale => {
        skylight.intensity = scale
        light.intensity = scale * 0.5
    })

    return () => {
        skylight.dispose()
        scene.remove(skylight)

        light.dispose()
        scene.remove(light)

        handle.cancel()
    }
}, [getDefaultLight])