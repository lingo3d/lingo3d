import store from "@lincode/reactivity"
import { getPerformance } from "./usePerformance"

export const [setPixelRatio, getPixelRatio] = store(1)

getPerformance(val => val === "quality" && setPixelRatio(devicePixelRatio))