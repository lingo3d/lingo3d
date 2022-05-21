import store from "@lincode/reactivity"
import PositionedItem from "../api/core/PositionedItem"

export const [setSelectionTarget, getSelectionTarget] = store<PositionedItem | undefined>(undefined)