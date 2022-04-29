import { createEffect } from "@lincode/reactivity"
import { Color, EquirectangularReflectionMapping } from "three"
import scene from "./scene"
import loadCubeTexture from "../../display/utils/loaders/loadCubeTexture"
import loadTexture from "../../display/utils/loaders/loadTexture"
import { getBackgroundColor } from "../../states/useBackgroundColor"
import { getBackgroundImage } from "../../states/useBackgroundImage"
import { getSkyboxStack } from "../../states/useSkyboxStack"
import { last } from "@lincode/utils"

export default {}

createEffect(() => {
    const image = getBackgroundImage()
    const color = getBackgroundColor()
    const skybox = last(getSkyboxStack())?.texture

    if (skybox) {
        if (Array.isArray(skybox))
            scene.background = loadCubeTexture(skybox)
        else {
            let proceed = true
            const texture = loadTexture(skybox, () => proceed && (scene.background = texture))
            texture.mapping = EquirectangularReflectionMapping
            return () => {
                proceed = false
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

}, [getBackgroundColor, getBackgroundImage, getSkyboxStack])