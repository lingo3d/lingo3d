import { lightDefaults } from "lingo3d/lib/interface/ILight"

const props = {
    color: {
        type: String,
        default: lightDefaults.color
    },
    intensity: {
        type: Number,
        default: lightDefaults.intensity
    },
}

export default props