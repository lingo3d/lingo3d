import store from "@lincode/reactivity"

export const [setShadowDistance, getShadowDistance] = store<number | undefined>(
    undefined
)
