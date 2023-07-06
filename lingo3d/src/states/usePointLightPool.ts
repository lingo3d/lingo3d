import store from "@lincode/reactivity"
import { pointLightPoolPtr } from "../pointers/pointLightPoolPtr"

export const [setPointLightPool, getPointLightPool] = store(4)

getPointLightPool((val) => (pointLightPoolPtr[0] = val))
