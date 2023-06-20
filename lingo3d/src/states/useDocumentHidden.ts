import store from "@lincode/reactivity"
import { IS_MOBILE } from "../globals"

const [setDocumentHidden, getDocumentHidden] = store(false)
export { getDocumentHidden }

if (!IS_MOBILE) {
    const setHidden = () =>
        setDocumentHidden(document.hidden || !document.hasFocus())
    setInterval(setHidden, 1000)
    window.addEventListener("blur", () => setDocumentHidden(true))
    window.addEventListener("focus", () => setDocumentHidden(false))
    document.addEventListener("visibilitychange", setHidden)
}
