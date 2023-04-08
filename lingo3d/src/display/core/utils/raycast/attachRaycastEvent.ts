import { Object3D } from "three"
import { LingoMouseEvent } from "../../../../interface/IMouse"
import VisibleMixin from "../../mixins/VisibleMixin"
import { onMouseDown } from "../../../../events/onMouseDown"
import { mouseRaycast } from "../../../../cachedUtils/mouseRaycast"

export default (
    onEvent: typeof onMouseDown,
    candidates: Set<Object3D>,
    cbManager: (manager: VisibleMixin, e: LingoMouseEvent) => void,
    cbNative?: (mesh: Object3D) => void
) =>
    onEvent((e) => {
        const result = mouseRaycast(candidates, {
            x: e.xNorm,
            y: e.yNorm
        })
        if (!result) return

        const { point, distance, manager, normal, mesh } = result
        if (manager)
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
        else cbNative?.(mesh)
    })
