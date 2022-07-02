import store from "@lincode/reactivity"

export const [setAntiAlias, getAntiAlias] = store<"SMAA" | "SSAA" | false>("SMAA")