import store from "@lincode/reactivity"
import { ColorString } from "../interface/ITexturedStandard"

export const [setOutlineColor, getOutlineColor] = store<ColorString>("#ffffff")
