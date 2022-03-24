import store from "@lincode/reactivity"

export type DefaultLight = boolean | "studio"

export const [setDefaultLight, getDefaultLight] = store<DefaultLight>(true)