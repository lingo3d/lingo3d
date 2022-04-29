import store from "@lincode/reactivity"

export type DefaultLight = boolean | "studio" | string

export const [setDefaultLight, getDefaultLight] = store<DefaultLight>(true)