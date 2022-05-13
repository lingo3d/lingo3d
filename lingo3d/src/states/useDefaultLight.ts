import store from "@lincode/reactivity"

export type DefaultLight = boolean | "default" | "studio" | string

export const [setDefaultLight, getDefaultLight] = store<DefaultLight>("default")