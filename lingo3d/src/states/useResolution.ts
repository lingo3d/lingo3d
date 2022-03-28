import store from "@lincode/reactivity"
import { getContainerSize } from "./useContainerSize"

export const [setResolution, getResolution] = store(getContainerSize())
getContainerSize(setResolution)