import { assign, omit, store } from "@lincode/reactivity"

const [setScriptSystemNames, getScriptSystemNames] = store<
    Record<string, Array<string>>
>({})
export { getScriptSystemNames }

export const assignScriptSystemNames = assign(
    setScriptSystemNames,
    getScriptSystemNames
)

export const omitScriptSystemNames = omit(
    setScriptSystemNames,
    getScriptSystemNames
)
