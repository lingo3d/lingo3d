import { pointLightDefaults } from "lingo3d/lib/interface/IPointLight"
import lightProps from "./lightProps"

const props = {
    ...lightProps,
    decay:{
        type: Number,
        default : pointLightDefaults.decay
    },
    distance:{
        type: Number,
        default: pointLightDefaults.distance
    },
    power:{
        type:Number,
        default:pointLightDefaults.power
    },
}
export default props