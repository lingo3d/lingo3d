import store from "@lincode/reactivity"

export const [setBackgroundSkybox, getBackgroundSkybox] = store<string | Array<string> | undefined>(undefined)