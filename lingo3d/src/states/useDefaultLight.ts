import store from "@lincode/reactivity"

type DefaultLight = boolean | "default" | "studio" | "dynamic" | string

export const [setDefaultLight, getDefaultLight] = store<DefaultLight>("default")
