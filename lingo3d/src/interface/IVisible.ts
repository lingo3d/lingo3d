import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

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

export const visibleDefaults = extendDefaults<IVisible>([], {
    bloom: false,
    outline: false,

    visible: true,
    frustumCulled: true,
    castShadow: true,
    receiveShadow: true
})
