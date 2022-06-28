import store from "@lincode/reactivity"

export const [setAntiAlias, getAntiAlias] = store<"MSAA" | "SSAA" | false>("MSAA")