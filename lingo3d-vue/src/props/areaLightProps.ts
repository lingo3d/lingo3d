import { areaLightDefaults } from "lingo3d/lib/interface/IAreaLight"
import lightProps from "./lightProps"

const props = {
    ...lightProps,
    power: {
        type: Number,
        default: areaLightDefaults.power
    }
}

export default props