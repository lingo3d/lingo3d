import store from "@lincode/reactivity"

type Data = {
    raw?: string
    compiled?: string
}

export const [setScriptTest, getScriptTest] = store<Data | undefined>(undefined)
