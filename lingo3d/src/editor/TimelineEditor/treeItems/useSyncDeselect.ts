import { useLayoutEffect } from "preact/hooks"
import Appendable from "../../../api/core/Appendable"
import { useSelectionTarget } from "../../states"
import {
    getTimelineLayer,
    setTimelineLayer
} from "../../states/useTimelineLayer"

export default (
    selected: boolean,
    instance: Appendable | undefined,
    layer: string | undefined
) => {
    const [selectionTarget] = useSelectionTarget()

    useLayoutEffect(() => {
        if (selectionTarget === instance && selected)
            return () => {
                getTimelineLayer() === layer && setTimelineLayer("")
            }
    }, [selectionTarget, selected])
}
