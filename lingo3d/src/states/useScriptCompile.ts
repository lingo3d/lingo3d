import store from "@lincode/reactivity"

type Data = {
    raw?: string
    compiled?: string
}

export const [setScriptCompile, getScriptCompile] = store<Data | undefined>(
    undefined
)
