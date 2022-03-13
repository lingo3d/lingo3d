import store from "@lincode/reactivity"
import { debounce } from "@lincode/utils"

const [setSelectionEnabled0, getSelectionEnabled] = store(true)
export { getSelectionEnabled }

export const setSelectionEnabled = debounce(setSelectionEnabled0, 1, "trailing")