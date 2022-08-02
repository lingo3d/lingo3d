import store from "@lincode/reactivity"

type AmbientOcclusion = boolean | "light"

export const [setAmbientOcclusion, getAmbientOcclusion] =
    store<AmbientOcclusion>(false)
