import store from "@lincode/reactivity"

export const [setBackgroundColor, getBackgroundColor] = store<string | undefined>(undefined)