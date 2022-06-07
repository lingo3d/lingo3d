import store from "@lincode/reactivity"

export const [setAutoMount, getAutoMount] = store<boolean | string | HTMLElement>(false)