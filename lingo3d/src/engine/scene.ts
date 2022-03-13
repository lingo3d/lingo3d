import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { Color, DirectionalLight, Fog, HemisphereLight, Scene, WebGLCubeRenderTarget } from "three"
import loadCubeTexture from "../display/utils/loaders/loadCubeTexture"
import loadTexture from "../display/utils/loaders/loadTexture"
import loadTextureAsync from "../display/utils/loaders/loadTextureAsync"
import { getBackgroundColor } from "../states/useBackgroundColor"
import { getBackgroundImage } from "../states/useBackgroundImage"
import { getBackgroundSkybox } from "../states/useBackgroundSkybox"
import { getDefaultFog } from "../states/useDefaultFog"
import { getDefaultLight } from "../states/useDefaultLight"
import { camFar, camNear } from "./constants"
import { renderer } from "./render/renderer"

const scene = new Scene()
export default scene

createEffect(() => {
    const image = getBackgroundImage()
    const color = getBackgroundColor()
    const skybox = getBackgroundSkybox()

    if (skybox) {
        if (Array.isArray(skybox))
            scene.background = loadCubeTexture(skybox)
        else {
            const handle = new Cancellable()
            loadTextureAsync(skybox).then(texture => {
                if (handle.done) return
                const renderTarget = new WebGLCubeRenderTarget(texture.image.height)
                renderTarget.fromEquirectangularTexture(renderer, texture)
                scene.background = renderTarget.texture
                handle.then(() => renderTarget.dispose())
            })
            return () => {
                handle.cancel()
            }
        }
    }
    else if (image)
        scene.background = loadTexture(image)
    else if (color) {
        if (color === "transparent" || color === "none")
            scene.background = null
        else
            scene.background = new Color(color)
    }
    else scene.background = new Color("black")

}, [getBackgroundColor, getBackgroundImage, getBackgroundSkybox])

createEffect(() => {
    if (!getDefaultLight()) return

    const skylight = new HemisphereLight(0xffffff, 0x666666, 1)
    scene.add(skylight)

    const light = new DirectionalLight(0xffffff, 0.5)
    light.position.set(0, 1, 1)
    scene.add(light)
    // light.castShadow = true
    // light.shadow.camera.near = camNear
    // light.shadow.camera.far = camFar

    return () => {
        skylight.dispose()
        scene.remove(skylight)

        light.dispose()
        scene.remove(light)
    }
}, [getDefaultLight])

createEffect(() => {
    if (!getDefaultFog()) return

    scene.fog = new Fog(0x000000, 0, 100)

    return () => {
        scene.fog = null
    }
}, [getDefaultFog])
