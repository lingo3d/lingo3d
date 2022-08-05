import store, { push, pull } from "@lincode/reactivity"
import Skybox from "../display/Skybox"

export const [setSkyboxStack, getSkyboxStack] = store<Array<Skybox>>([])

export const pushSkyboxStack = push(setSkyboxStack, getSkyboxStack)
export const pullSkyboxStack = pull(setSkyboxStack, getSkyboxStack)
