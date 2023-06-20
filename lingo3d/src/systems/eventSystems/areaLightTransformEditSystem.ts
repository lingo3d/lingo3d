import AreaLight from "../../display/lights/AreaLight"
import { onTransformEdit } from "../../events/onTransformEdit"
import { configAreaLightSystem } from "../configSystems/configAreaLightSystem"
import createInternalSystem from "../utils/createInternalSystem"

export const areaLightTransformEditSystem = createInternalSystem(
    "areaLightTransformEditSystem",
    {
        update: (self: AreaLight, _, { target, phase, mode }) => {
            self === target &&
                mode === "scale" &&
                phase === "end" &&
                configAreaLightSystem.add(self)
        },
        updateTicker: onTransformEdit
    }
)
