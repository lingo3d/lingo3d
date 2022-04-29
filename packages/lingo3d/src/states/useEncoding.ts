import store from "@lincode/reactivity"

export type Encoding = "sRGB" | "linear"

export const [setEncoding, getEncoding] = store<Encoding>("linear")