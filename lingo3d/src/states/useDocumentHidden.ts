import store from "@lincode/reactivity"
import { IS_MOBILE } from "../globals"

const [setDocumentHidden, getDocumentHidden] = store(false)
export { getDocumentHidden }

!IS_MOBILE &&
    setInterval(
        () => setDocumentHidden(document.hidden || !document.hasFocus()),
        1000
    )
