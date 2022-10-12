import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"

export default interface IVisible {
    bloom: boolean
    outline: boolean

    visible: boolean
    frustumCulled: boolean
    castShadow: boolean
    receiveShadow: boolean
}

export const visibleSchema: Required<ExtractProps<IVisible>> = {
    bloom: Boolean,
    outline: Boolean,

    visible: Boolean,
    frustumCulled: Boolean,
    castShadow: Boolean,
    receiveShadow: Boolean
}
hideSchema(["frustumCulled", "visible"])

export const visibleDefaults: Defaults<IVisible> = {
    bloom: false,
    outline: false,

    visible: true,
    frustumCulled: true,
    castShadow: true,
    receiveShadow: true
}
