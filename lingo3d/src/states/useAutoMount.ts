import store from "@lincode/reactivity"

export type AutoMount = boolean | string | HTMLElement

export const [setAutoMount, getAutoMount] = store<AutoMount>(false)
