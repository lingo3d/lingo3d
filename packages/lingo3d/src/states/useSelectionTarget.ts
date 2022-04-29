import store from "@lincode/reactivity"
import SimpleObjectManager from "../display/core/SimpleObjectManager"

export const [setSelectionTarget, getSelectionTarget] = store<SimpleObjectManager | undefined>(undefined)