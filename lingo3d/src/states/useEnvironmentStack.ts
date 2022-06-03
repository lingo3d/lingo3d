import store, { push, pull } from "@lincode/reactivity"
import Environment from "../display/Environment"

export const [setEnvironmentStack, getEnvironmentStack] = store<Array<Environment>>([])

export const pushEnvironmentStack = push(setEnvironmentStack, getEnvironmentStack)
export const pullEnvironmentStack = pull(setEnvironmentStack, getEnvironmentStack)