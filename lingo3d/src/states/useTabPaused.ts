import store, { createEffect } from "@lincode/reactivity"
import { getTabVisible } from "./useTabVisible"
import { getTabFocused } from "./useTabFocused"
import { getEditorBehavior } from "./useEditorBehavior"
import { IS_MOBILE } from "../globals"

const [setTabPaused, getTabPaused] = store(false)
export { getTabPaused }

createEffect(() => {
    setTabPaused(getEditorBehavior() && (!getTabVisible() || !getTabFocused()))
}, [getTabVisible, getTabFocused, getEditorBehavior])

!IS_MOBILE &&
    setInterval(
        () => setTabPaused(document.hidden || !document.hasFocus()),
        1000
    )
