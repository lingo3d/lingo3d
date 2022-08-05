import store from "@lincode/reactivity"
import Dummy from "../display/Dummy"

export const [setRetargetBones, getRetargetBones] = store<Dummy | undefined>(
    undefined
)
