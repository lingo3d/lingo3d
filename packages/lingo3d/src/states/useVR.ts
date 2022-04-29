import store from "@lincode/reactivity"

export type VR = boolean | "webxr"

export const [setVR, getVR] = store<VR>(false)