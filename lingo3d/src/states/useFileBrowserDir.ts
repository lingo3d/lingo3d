import store from "@lincode/reactivity"
import { fileBrowserDirPtr } from "../pointers/fileBrowserDirPtr"

export const [setFileBrowserDir, getFileBrowserDir] = store("")

getFileBrowserDir((dir) => (fileBrowserDirPtr[0] = dir))
