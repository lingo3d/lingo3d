import store from "@lincode/reactivity"
import type { FileWithHandle } from "browser-fs-access"

export const [setFileCurrent, getFileCurrent] = store<
    FileWithHandle | undefined
>(undefined)
