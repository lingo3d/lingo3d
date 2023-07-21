import store from "@lincode/reactivity"
import { getFileCurrent } from "./useFileCurrent"

const [setSessionToken, getSessionToken] = store({})
export { getSessionToken }

getFileCurrent(() => setSessionToken({}))
