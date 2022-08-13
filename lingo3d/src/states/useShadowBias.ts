import store from "@lincode/reactivity"

export const [setShadowBias, getShadowBias] = store<number | undefined>(
    undefined
)
