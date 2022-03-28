import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { forceGet } from "@lincode/utils"
import { Color, DirectionalLight, Fog, HemisphereLight, Scene, Texture, WebGLCubeRenderTarget } from "three"
import loadCubeTexture from "../display/utils/loaders/loadCubeTexture"
import loadTexture from "../display/utils/loaders/loadTexture"
import loadTextureAsync from "../display/utils/loaders/loadTextureAsync"
import { getBackgroundColor } from "../states/useBackgroundColor"
import { getBackgroundImage } from "../states/useBackgroundImage"
import { getBackgroundSkybox } from "../states/useBackgroundSkybox"
import { getDefaultFog } from "../states/useDefaultFog"
import { getDefaultLight } from "../states/useDefaultLight"
import { getRenderer } from "../states/useRenderer"

const scene = new Scene()
export default scene

const textureCubeRenderTargetMap = new WeakMap<Texture, WebGLCubeRenderTarget>()

createEffect(() => {
    const image = getBackgroundImage()
    const color = getBackgroundColor()
    const skybox = getBackgroundSkybox()
    const renderer = getRenderer()

    if (skybox) {
        if (Array.isArray(skybox))
            scene.background = loadCubeTexture(skybox)
        else {
            let done = false
            loadTextureAsync(skybox).then(texture => {
                if (done) return
                const renderTarget = forceGet(textureCubeRenderTargetMap, texture, () => (
                    new WebGLCubeRenderTarget(texture.image.height)
                ))
                renderTarget.fromEquirectangularTexture(renderer, texture)
                scene.background = renderTarget.texture
            })
            return () => {
                done = true
            }
        }
    }
    else if (image)
        scene.background = loadTexture(image)
    else if (color) {
        if (color === "transparent")
            scene.background = null
        else
            scene.background = new Color(color)
    }
    else scene.background = new Color("black")

}, [getBackgroundColor, getBackgroundImage, getBackgroundSkybox, getRenderer])

createEffect(() => {
    const defaultLight = getDefaultLight()
    if (!defaultLight) return

    if (defaultLight === "studio") {
        const handle = new Cancellable()
        ;(async () => {
            const AreaLight = (await import("../display/lights/AreaLight")).default
            if (handle.done) return
            
            handle.watch(Object.assign(new AreaLight(), { innerY: 1000, innerRotationX: -90, intensity: 3 }))
            handle.watch(Object.assign(new AreaLight(), { innerY: 1000, innerRotationX: -90, rotationX: 90, intensity: 3 }))
            handle.watch(Object.assign(new AreaLight(), { innerY: 1000, innerRotationX: -90, rotationX: -90, intensity: 3 }))
            handle.watch(Object.assign(new AreaLight(), { innerY: 1000, innerRotationX: -90, rotationZ: 90, intensity: 3 }))
            handle.watch(Object.assign(new AreaLight(), { innerY: 1000, innerRotationX: -90, rotationZ: -90, intensity: 3 }))
        })()
        return () => {
            handle.cancel()
        }
    }

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
