import store, { push, pull, refresh } from "@lincode/reactivity"
import { debounce } from "@lincode/utils"
import Setup from "../display/Setup"

const [setSetupStack, getSetupStack] = store<Array<Setup>>([])
export { getSetupStack }

export const pushSetupStack = push(setSetupStack, getSetupStack)
export const pullSetupStack = pull(setSetupStack, getSetupStack)

export const refreshSetupStack = debounce(
    refresh(setSetupStack, getSetupStack),
    0,
    "trailing"
)
