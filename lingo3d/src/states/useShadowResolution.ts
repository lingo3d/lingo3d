import store from "@lincode/reactivity"

export type ShadowResolution = "low" | "medium" | "high"

export const [setShadowResolution, getShadowResolution] =
    store<ShadowResolution>("medium")
