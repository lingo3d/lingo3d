import store from "@lincode/reactivity"
import type { FileWithHandle } from "browser-fs-access"
import { onUnload } from "../events/onUnload"

export const [setFileCurrent, getFileCurrent] = store<
    FileWithHandle | undefined
>(undefined)

onUnload(() => setFileCurrent(undefined))
