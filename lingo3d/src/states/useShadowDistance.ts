import store from "@lincode/reactivity"

export type ShadowDistance = "near" | "medium" | "far"

export const [setShadowDistance, getShadowDistance] =
    store<ShadowDistance>("medium")
