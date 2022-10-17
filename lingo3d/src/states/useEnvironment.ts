import store from "@lincode/reactivity"

export const [setEnvironment, getEnvironment] = store<string | undefined>(
    undefined
)
