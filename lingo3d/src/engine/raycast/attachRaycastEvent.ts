import { Object3D } from "three"
import { LingoMouseEvent } from "../../interface/IMouse"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import { onMouseDown } from "../../events/onMouseDown"
import { raycast } from "../../memo/raycast"

export default (
    onEvent: typeof onMouseDown,
    candidates: Set<Object3D>,
    cbManager: (manager: VisibleMixin, e: LingoMouseEvent) => void
) =>
    onEvent((e) => {
        const result = raycast(candidates, {
            pointer: { x: e.xNorm, y: e.yNorm }
        })
        if (!result) return

        const { point, distance, manager, normal } = result
        cbManager(
            manager,
            new LingoMouseEvent(
                e.x,
                e.y,
                e.clientX,
                e.clientY,
                e.xNorm,
                e.yNorm,
                point,
                normal,
                distance,
                manager
            )
        )
    })
