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
            self.onClick && clickSet.add(self.$innerObject)
            self.onMouseDown && mouseDownSet.add(self.$innerObject)
            self.onMouseUp && mouseUpSet.add(self.$innerObject)
            self.onMouseMove && mouseMoveSet.add(self.$innerObject)
            self.onMouseOut && mouseOutSet.add(self.$innerObject)
            self.onMouseOver && mouseOverSet.add(self.$innerObject)
        },
        cleanup: (self) => {
            clickSet.delete(self.$innerObject)
            mouseDownSet.delete(self.$innerObject)
            mouseUpSet.delete(self.$innerObject)
            mouseMoveSet.delete(self.$innerObject)
            mouseOutSet.delete(self.$innerObject)
            mouseOverSet.delete(self.$innerObject)
        }
    }
)
