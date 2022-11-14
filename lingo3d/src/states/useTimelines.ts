import store from "@lincode/reactivity"
import { AnimationData } from "../api/serializer/types"

export const [setTimelines, getTimelines] = store<Array<AnimationData>>([])
