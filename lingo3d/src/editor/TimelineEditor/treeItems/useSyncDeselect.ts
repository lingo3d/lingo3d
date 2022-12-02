import { useLayoutEffect } from "preact/hooks"
import Appendable from "../../../api/core/Appendable"
import { getSelectionTarget } from "../../../states/useSelectionTarget"
import useSyncState from "../../hooks/useSyncState"
import {
    getTimelineLayer,
    setTimelineLayer
} from "../../../states/useTimelineLayer"

export default (
    selected: boolean,
    instance: Appendable | undefined,
    layer: string | undefined
) => {
    const selectionTarget = useSyncState(getSelectionTarget)

    useLayoutEffect(() => {
        if (selectionTarget === instance && selected)
            return () => {
                getTimelineLayer() === layer && setTimelineLayer("")
            }
    }, [selectionTarget, selected])
}
