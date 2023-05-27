import store from "@lincode/reactivity"
import { IS_MOBILE } from "../globals"

const [setTabVisible, getTabVisible] = store(true)
export { getTabVisible }

!IS_MOBILE &&
    document.addEventListener("visibilitychange", () =>
        setTabVisible(document.visibilityState === "visible")
    )
