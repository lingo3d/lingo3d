import { spotLightDefaults } from "lingo3d/lib/interface/ISpotLight"
import lightProps from "./lightProps"


const props = {
    ...lightProps,
    anale:{
        type:Number,
        default:spotLightDefaults.angle
    },
    penumbra: {
        type:Number,
        default:spotLightDefaults.penumbra
    },
}
export default props