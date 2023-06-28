import store from "@lincode/reactivity"

type Data = {
    raw?: string
    compiled?: string
}

export const [setScriptRuntime, getScriptRuntime] = store<Data | undefined>(
    undefined
)
