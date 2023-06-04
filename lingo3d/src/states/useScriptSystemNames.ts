import { assign, store } from "@lincode/reactivity"

const [setScriptSystemNames, getScriptSystemNames] = store<
    Record<string, Array<string>>
>({})

export const assignScriptSystemNames = assign(
    setScriptSystemNames,
    getScriptSystemNames
)
