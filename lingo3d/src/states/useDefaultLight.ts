import store from "@lincode/reactivity"

type DefaultLight = boolean | "studio" | string

export const [setDefaultLight, getDefaultLight] = store<DefaultLight>(true)
