import store from "@lincode/reactivity"
import isMobile from "../api/utils/isMobile"

export const [setAntiAlias, getAntiAlias] = store<"SMAA" | "SSAA" | false>(isMobile ? "SSAA" : "SMAA")