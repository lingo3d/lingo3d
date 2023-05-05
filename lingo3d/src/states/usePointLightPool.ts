import store from "@lincode/reactivity"
import { pointLightPoolPtr } from "../pointers/pointLightPoolPtr"

export const [setPointLightPool, getPointLightPool] = store(4)

getPointLightPool((size) => (pointLightPoolPtr[0] = size))
