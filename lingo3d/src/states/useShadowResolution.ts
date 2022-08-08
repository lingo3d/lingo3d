import store from "@lincode/reactivity"

export const [setShadowResolution, getShadowResolution] = store<
    number | undefined
>(undefined)
