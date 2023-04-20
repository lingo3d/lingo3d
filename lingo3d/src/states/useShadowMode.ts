import store from "@lincode/reactivity"

export const [setShadowMode, getShadowMode] = store<boolean | "physics">(true)
