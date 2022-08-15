import store from "@lincode/reactivity"

export const [setFiles, getFiles] = store<Array<File> | undefined>(undefined)
