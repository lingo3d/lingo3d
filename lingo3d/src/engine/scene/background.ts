import { createEffect } from "@lincode/reactivity"
import { forceGet } from "@lincode/utils"
import { Texture, WebGLCubeRenderTarget, Color } from "three"
import scene from "./scene"
import loadCubeTexture from "../../display/utils/loaders/loadCubeTexture"
import loadTexture from "../../display/utils/loaders/loadTexture"
import loadTextureAsync from "../../display/utils/loaders/loadTextureAsync"
import { getBackgroundColor } from "../../states/useBackgroundColor"
import { getBackgroundImage } from "../../states/useBackgroundImage"
import { getBackgroundSkybox } from "../../states/useBackgroundSkybox"
import { getRenderer } from "../../states/useRenderer"

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