import store, { push, pull, refresh } from "@lincode/reactivity"
import Environment from "../display/Environment"

const [setEnvironmentStack, getEnvironmentStack] = store<Array<Environment>>([])
export { getEnvironmentStack }

export const pushEnvironmentStack = push(
    setEnvironmentStack,
    getEnvironmentStack
)
export const pullEnvironmentStack = pull(
    setEnvironmentStack,
    getEnvironmentStack
)
export const refreshEnvironmentStack = refresh(
    setEnvironmentStack,
    getEnvironmentStack
)
