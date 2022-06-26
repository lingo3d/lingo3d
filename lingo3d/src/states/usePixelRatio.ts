import store from "@lincode/reactivity"

export const [setPixelRatio, getPixelRatio] = store<number | undefined>(undefined)