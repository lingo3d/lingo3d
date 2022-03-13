import store from "@lincode/reactivity"
import { getPerformance } from "./usePerformance"

export const [setResolutionScale, getResolutionScale] = store(1)

getPerformance(val => setResolutionScale(val === "speed" ? 0.6 : val === "quality" ? 2 : 1))