import store from "@lincode/reactivity"
import { IS_MOBILE } from "../globals"

const [setTabFocused, getTabFocused] = store(true)
export { getTabFocused }

if (!IS_MOBILE) {
    window.addEventListener("blur", () => setTabFocused(false))
    window.addEventListener("focus", () => setTabFocused(true))
}
