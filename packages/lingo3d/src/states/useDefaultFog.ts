import store from "@lincode/reactivity"

export const [setDefaultFog, getDefaultFog] = store<string | undefined>(undefined)