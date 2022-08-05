import store from "@lincode/reactivity"

export const [setOutlinePattern, getOutlinePattern] = store<string | undefined>(
    undefined
)
