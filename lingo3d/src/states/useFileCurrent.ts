import store from "@lincode/reactivity"
import { FileWithHandle } from "browser-fs-access"

export const [setFileCurrent, getFileCurrent] = store<
    FileWithHandle | undefined
>(undefined)
