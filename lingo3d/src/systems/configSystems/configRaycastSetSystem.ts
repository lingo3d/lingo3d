import {
    clickSet,
    mouseDownSet,
    mouseMoveSet,
    mouseOutSet,
    mouseOverSet,
    mouseUpSet
} from "../../collections/mouseSets"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import createInternalSystem from "../utils/createInternalSystem"

export const configRaycastSetSystem = createInternalSystem(
    "configRaycastSetSystem",
    {
        effect: (self: VisibleMixin) => {
            self.onClick && clickSet.add(self.object3d)
            self.onMouseDown && mouseDownSet.add(self.object3d)
            self.onMouseUp && mouseUpSet.add(self.object3d)
            self.onMouseMove && mouseMoveSet.add(self.object3d)
            self.onMouseOut && mouseOutSet.add(self.object3d)
            self.onMouseOver && mouseOverSet.add(self.object3d)
        },
        cleanup: (self) => {
            clickSet.delete(self.object3d)
            mouseDownSet.delete(self.object3d)
            mouseUpSet.delete(self.object3d)
            mouseMoveSet.delete(self.object3d)
            mouseOutSet.delete(self.object3d)
            mouseOverSet.delete(self.object3d)
        }
    }
)
