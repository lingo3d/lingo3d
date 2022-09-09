import store from "@lincode/reactivity"

export const [setFileHandle, getFileHandle] = store<
    FileSystemFileHandle | undefined | null
>(undefined)
