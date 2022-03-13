import { getBackgroundColor, setBackgroundColor } from "../states/useBackgroundColor"
import { getBackgroundImage, setBackgroundImage } from "../states/useBackgroundImage"
import { getBackgroundSkybox, setBackgroundSkybox } from "../states/useBackgroundSkybox"

export default {
    get texture() {
        return getBackgroundImage()
    },
    set texture(value: string | undefined) {
        setBackgroundImage(value)
    },

    get skybox() {
        return getBackgroundSkybox()
    },
    set skybox(value: string | Array<string> | undefined) {
        setBackgroundSkybox(value)
    },

    get color() {
        return getBackgroundColor()
    },
    set color(value: string | undefined) {
        setBackgroundColor(value)
    }
}