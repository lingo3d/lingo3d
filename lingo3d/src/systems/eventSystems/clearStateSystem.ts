import Appendable from "../../api/core/Appendable"
import { onDispose } from "../../events/onDispose"
import eventSimpleSystemWithData from "../utils/eventSimpleSystemWithData"

export const [addClearStateSystem, deleteClearStateSystem] =
    eventSimpleSystemWithData(
        (self: Appendable, data: { setState: (val: any) => void }, payload) =>
            self === payload && data.setState(undefined),
        onDispose
    )
