import store, { createEffect } from "@lincode/reactivity"
import { getEditorBehavior } from "./useEditorBehavior"
import { editorBehaviorPtr } from "../pointers/editorBehaviorPtr"
import { IS_MOBILE } from "../globals"

const [setDocumentHidden, getDocumentHidden] = store(false)
export { getDocumentHidden }

createEffect(() => {
    if (!editorBehaviorPtr[0] || IS_MOBILE) return

    const setHidden = () =>
        setDocumentHidden(document.hidden || !document.hasFocus())
    const interval = setInterval(setHidden, 1000)
    const handleBlur = () => setDocumentHidden(true)
    const handleFocus = () => setDocumentHidden(false)
    window.addEventListener("blur", handleBlur)
    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", setHidden)

    return () => {
        clearInterval(interval)
        window.removeEventListener("blur", handleBlur)
        window.removeEventListener("focus", handleFocus)
        document.removeEventListener("visibilitychange", setHidden)
    }
}, [getEditorBehavior])
