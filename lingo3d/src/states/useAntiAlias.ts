import store from "@lincode/reactivity"
import isMobile from "../api/utils/isMobile"

export const [setAntiAlias, getAntiAlias] = store<"MSAA" | "SMAA" | "SSAA" | false>(isMobile ? "SSAA" : "MSAA")