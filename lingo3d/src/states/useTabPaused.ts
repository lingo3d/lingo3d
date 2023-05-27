import store, { createEffect } from "@lincode/reactivity"
import { getTabVisible } from "./useTabVisible"
import { getTabFocused } from "./useTabFocused"
import { getEditorBehavior } from "./useEditorBehavior"

const [setTabPaused, getTabPaused] = store(false)
export { getTabPaused }

createEffect(() => {
    setTabPaused(getEditorBehavior() && (!getTabVisible() || !getTabFocused()))
}, [getTabVisible, getTabFocused, getEditorBehavior])
