import store, { push, pull, refresh } from "@lincode/reactivity"
import Skybox from "../display/Skybox"

const [setSkyboxStack, getSkyboxStack] = store<Array<Skybox>>([])
export { getSkyboxStack }

export const pushSkyboxStack = push(setSkyboxStack, getSkyboxStack)
export const pullSkyboxStack = pull(setSkyboxStack, getSkyboxStack)
export const refreshSkyboxStack = refresh(setSkyboxStack, getSkyboxStack)
