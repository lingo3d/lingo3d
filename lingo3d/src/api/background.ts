import Skybox from "../display/Skybox"
import { getBackgroundColor, setBackgroundColor } from "../states/useBackgroundColor"
import { getBackgroundImage, setBackgroundImage } from "../states/useBackgroundImage"
import { appendableRoot } from "./core/Appendable"

const defaultSkybox = new Skybox()
appendableRoot.delete(defaultSkybox)

export default {
    get texture() {
        return getBackgroundImage()
    },
    set texture(value: string | undefined) {
        setBackgroundImage(value)
    },

    get skybox() {
        return defaultSkybox.texture
    },
    set skybox(value: string | Array<string> | undefined) {
        defaultSkybox.texture = value
    },

    get color() {
        return getBackgroundColor()
    },
    set color(value: string) {
        setBackgroundColor(value)
    }
}