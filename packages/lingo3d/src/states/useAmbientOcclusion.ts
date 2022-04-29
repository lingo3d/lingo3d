import store from "@lincode/reactivity"

export type AmbientOcclusion = boolean | "light"

export const [setAmbientOcclusion, getAmbientOcclusion] = store<AmbientOcclusion>(false)