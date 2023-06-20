import Appendable from "../../display/core/Appendable"
import { onDispose } from "../../events/onDispose"
import createInternalSystem from "../utils/createInternalSystem"

export const disposeStateSystem = createInternalSystem("disposeStateSystem", {
    data: {} as { setState: (val: any) => void },
    update: (self: Appendable, data, payload) =>
        self === payload && data.setState(undefined),
    updateTicker: onDispose
})
