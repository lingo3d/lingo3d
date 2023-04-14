import store from "@lincode/reactivity"
import { ColorString } from "../interface/ITexturedStandard"

export const [setOutlineHiddenColor, getOutlineHiddenColor] =
    store<ColorString>("#000000")
