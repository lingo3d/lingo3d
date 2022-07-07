import { createEffect } from "@lincode/reactivity"
import { last } from "@lincode/utils"
import { HemisphereLight, DirectionalLight, EquirectangularReflectionMapping, WebGLCubeRenderTarget, LinearMipmapLinearFilter, CubeCamera } from "three"
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
import scene from "./scene"
import { KawaseBlurPass } from "postprocessing"

export default {}

const defaultEnvironment = new Environment()
appendableRoot.delete(defaultEnvironment)

createEffect(() => {
    const environment = last(getEnvironmentStack())?.texture
    if (!environment) return

    let proceed = true
    const texture = loadTexture(environment, () => proceed && (scene.environment = texture))
    texture.mapping = EquirectangularReflectionMapping
    
    return () => {
        proceed = false
        scene.environment = null
    }
}, [getEnvironmentStack])

const cubeRenderTarget = new WebGLCubeRenderTarget(64, {
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter
})
const cubeCamera = new CubeCamera(1, 100000, cubeRenderTarget)
const blurPass = new KawaseBlurPass()

blurPass.setSize(128, 128)

createEffect(() => {
    const defaultLight = getDefaultLight()
    if (!defaultLight) return

    if (typeof defaultLight === "string" && defaultLight !== "default") {
        if (defaultLight === "dynamic") {

            const handle = onBeforeRender(() => {
                const camera = getCameraRendered()
                const renderer = getRenderer()!

                cubeCamera.position.copy(getWorldPosition(camera))
                cubeCamera.matrixWorld.copy(camera.matrixWorld)

                cubeCamera.update(renderer, scene)
                renderer.render(scene, camera)

                scene.environment = cubeRenderTarget.texture
            })

            return () => {
                handle.cancel()
                scene.environment = null
            }
        }
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

    const light = new DirectionalLight(0xffffff, 0.5)
    light.position.set(0, 1, 1)
    scene.add(light)

    const handle = getDefaultLightScale(scale => {
        skylight.intensity = scale
        light.intensity = scale * 0.5
    })

    // light.castShadow = true
    // light.shadow.camera.near = camNear
    // light.shadow.camera.far = camFar

    return () => {
        skylight.dispose()
        scene.remove(skylight)

        light.dispose()
        scene.remove(light)

        handle.cancel()
    }
}, [getDefaultLight])