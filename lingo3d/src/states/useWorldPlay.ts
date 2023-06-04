import store from "@lincode/reactivity"

export const [setWorldPlay, getWorldPlay] = store<boolean | "script">(true)
