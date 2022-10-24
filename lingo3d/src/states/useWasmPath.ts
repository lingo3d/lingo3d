import store from "@lincode/reactivity"
import { WASM_URL } from "../globals"

export const [setWasmPath, getWasmPath] = store(WASM_URL)
