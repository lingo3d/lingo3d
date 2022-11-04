import store, { push, pull, refresh } from "@lincode/reactivity"
import { debounceTrailing } from "@lincode/utils"
import ISetup from "../interface/ISetup"

export const [setSetupStack, getSetupStack] = store<Array<Partial<ISetup>>>([])

export const pushSetupStack = push(setSetupStack, getSetupStack)
export const pullSetupStack = pull(setSetupStack, getSetupStack)

export const refreshSetupStack = debounceTrailing(
    refresh(setSetupStack, getSetupStack)
)
