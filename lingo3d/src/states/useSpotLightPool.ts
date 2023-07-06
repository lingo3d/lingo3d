import store from "@lincode/reactivity"
import { spotLightPoolPtr } from "../pointers/spotLightPoolPtr"

export const [setSpotLightPool, getSpotLightPool] = store(1)

getSpotLightPool((val) => (spotLightPoolPtr[0] = val))
