import AreaLight from "../../display/lights/AreaLight"
import { onTransformEdit } from "../../events/onTransformEdit"
import { addConfigAreaLightSystem } from "../configSystems/configAreaLightSystem"
import eventSystem from "../utils/eventSystem"

export const [addAreaLightTransformEditSystem] = eventSystem(
    (self: AreaLight, { target, phase, mode }) => {
        self === target &&
            mode === "scale" &&
            phase === "end" &&
            addConfigAreaLightSystem(self)
    },
    onTransformEdit
)
