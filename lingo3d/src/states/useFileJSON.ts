import store from "@lincode/reactivity"

export const [setFileJSON, getFileJSON] = store<File | undefined>(undefined)
