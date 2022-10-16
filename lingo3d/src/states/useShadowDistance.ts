import store from "@lincode/reactivity"

export type ShadowDistance = "near" | "middle" | "far"

export const [setShadowDistance, getShadowDistance] =
    store<ShadowDistance>("middle")
