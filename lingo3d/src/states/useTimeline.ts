import store from "@lincode/reactivity"
import Timeline from "../display/Timeline"

export const [setTimeline, getTimeline] = store<Timeline | undefined>(undefined)
