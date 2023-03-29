import { Reactive } from "@lincode/reactivity"
import renderSystemAutoClear from "../utils/renderSystemAutoClear"

export const [addRefreshStateSystem] = renderSystemAutoClear(
    (refreshState: Reactive<{}>) => refreshState.set({})
)
