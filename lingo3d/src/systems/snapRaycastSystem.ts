import { selectionCandidates } from "../collections/selectionCandidates"
import { vec2Point } from "../display/utils/vec2Point"
import visualize from "../display/utils/visualize"
import { TransformControls } from "../engine/transformControls/TransformControls"
import { raycast } from "../memo/raycast"
import { editorPlanePtr } from "../pointers/editorPlanePtr"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { Point3dType } from "../utils/isPoint"
import createInternalSystem from "./utils/createInternalSystem"

export const snapRaycastSystem = createInternalSystem("snapRaycastSystem", {
    data: {} as { direction: Point3dType },
    update: (self: TransformControls, data) => {
        const result = raycast(selectionCandidates, {
            //@ts-ignore
            origin: vec2Point(self.worldPosition),
            direction: data.direction,
            include: editorPlanePtr[0],
            exclude: selectionTargetPtr[0]
        })
        visualize("result", result?.point)
    }
})
