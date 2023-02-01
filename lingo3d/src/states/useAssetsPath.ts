import store from "@lincode/reactivity"
import { WASM_URL } from "../globals"

export const [setAssetsPath, getAssetsPath] = store(WASM_URL)
