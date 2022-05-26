import store from "@lincode/reactivity"
import EventLoopItem from "../api/core/EventLoopItem"

export const [setSelectionTarget, getSelectionTarget] = store<EventLoopItem | undefined>(undefined)