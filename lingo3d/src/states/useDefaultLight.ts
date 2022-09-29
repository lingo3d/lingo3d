import store from "@lincode/reactivity"

type DefaultLight = boolean | "default" | "studio" | string

export const [setDefaultLight, getDefaultLight] = store<DefaultLight>("default")
