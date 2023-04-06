import { Object3D } from "three"
import { LingoMouseEvent } from "../../../../interface/IMouse"
import VisibleMixin from "../../mixins/VisibleMixin"
import { onMouseDown } from "../../../../events/onMouseDown"
import { mouseRaycast } from "./mouseRaycast"

type Then = (obj: VisibleMixin, e: LingoMouseEvent) => void

export default (
    onEvent: typeof onMouseDown,
    candidates: Set<Object3D>,
    then: Then
) =>
    onEvent((e) => {
        const result = mouseRaycast(candidates, {
            x: e.xNorm,
            y: e.yNorm
        })
        if (!result) return

        const { point, distance, manager, normal } = result

        then(
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
