import store from "@lincode/reactivity"

export type DefaultLight = boolean | "default" | "studio" | "dynamic" | string

export const [setDefaultLight, getDefaultLight] = store<DefaultLight>("default")