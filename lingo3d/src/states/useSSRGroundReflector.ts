import type { Reflector } from "three/examples/jsm/objects/ReflectorForSSRPass.js"
import store from "@lincode/reactivity"

export const [setSSRGroundReflector, getSSRGroundReflector] = store<Reflector | null>(null)