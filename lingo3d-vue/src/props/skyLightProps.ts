import { skyLightDefaults } from "lingo3d/lib/interface/ISkyLight"
import lightProps from "./lightProps"


const props = {
    ...lightProps,
    groundColor:{
        type: String,
        default : skyLightDefaults.groundColor
    },
    
}
export default props