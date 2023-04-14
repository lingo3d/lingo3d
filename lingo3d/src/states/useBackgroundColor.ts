import store from "@lincode/reactivity"
import { ColorString } from "../interface/ITexturedStandard"

export const [setBackgroundColor, getBackgroundColor] = store<
    ColorString | "transparent"
>("#000000")
