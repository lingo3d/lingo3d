import store from "@lincode/reactivity"
import { ColorString } from "../interface/ITexturedStandard"
import { BACKGROUND_COLOR } from "../globals"

export const [setBackgroundColor, getBackgroundColor] = store<
    ColorString | "transparent"
>(BACKGROUND_COLOR)
