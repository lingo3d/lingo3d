import store from "@lincode/reactivity"
import { pixelRatioPtr } from "../pointers/pixelRatioPtr"

export const [setPixelRatio, getPixelRatio] = store(1)

getPixelRatio((ratio) => (pixelRatioPtr[0] = ratio))
