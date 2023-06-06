import AreaLight from "../../display/lights/AreaLight"
import { onTransformEdit } from "../../events/onTransformEdit"
import { configAreaLightSystem } from "../configSystems/configAreaLightSystem"
import eventSystem from "../utils/eventSystem"

export const [addAreaLightTransformEditSystem] = eventSystem(
    "areaLightTransformEditSystem",
    (self: AreaLight, { target, phase, mode }) => {
        self === target &&
            mode === "scale" &&
            phase === "end" &&
            configAreaLightSystem.add(self)
    },
    onTransformEdit
)
