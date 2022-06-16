import IAnimationMixin, { animationMixinDefaults, animationMixinSchema } from "./IAnimationMixin"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { LingoMouseEvent } from "./IMouse"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IStaticObjectManager extends IEventLoop, IAnimationMixin {
    onClick: Nullable<(e: LingoMouseEvent) => void>
    onMouseDown: Nullable<(e: LingoMouseEvent) => void>
    onMouseUp: Nullable<(e: LingoMouseEvent) => void>
    onMouseOver: Nullable<(e: LingoMouseEvent) => void>
    onMouseOut: Nullable<(e: LingoMouseEvent) => void>
    onMouseMove: Nullable<(e: LingoMouseEvent) => void>
    
    name: string
    id: Nullable<string>

    bloom: boolean
    reflection: boolean
    outline: boolean

    visible: boolean
    frustumCulled: boolean

    metalnessFactor: number
    roughnessFactor: number
    opacityFactor: number

    toon: boolean
    pbr: boolean
}

export const staticObjectManagerSchema: Required<ExtractProps<IStaticObjectManager>> = {
    ...eventLoopSchema,
    ...animationMixinSchema,

    onClick: Function,
    onMouseDown: Function,
    onMouseUp: Function,
    onMouseOver: Function,
    onMouseOut: Function,
    onMouseMove: Function,

    name: String,
    id: String,

    bloom: Boolean,
    reflection: Boolean,
    outline: Boolean,

    visible: Boolean,
    frustumCulled: Boolean,

    metalnessFactor: Number,
    roughnessFactor: Number,
    opacityFactor: Number,

    toon: Boolean,
    pbr: Boolean
}

export const staticObjectManagerDefaults: Defaults<IStaticObjectManager> = {
    ...eventLoopDefaults,
    ...animationMixinDefaults,

    onClick: undefined,
    onMouseDown: undefined,
    onMouseUp: undefined,
    onMouseOver: undefined,
    onMouseOut: undefined,
    onMouseMove: undefined,

    name: "",
    id: undefined,

    bloom: false,
    reflection: false,
    outline: false,

    visible: true,
    frustumCulled: true,

    metalnessFactor: 0,
    roughnessFactor: 1,
    opacityFactor: 1,

    toon: false,
    pbr: false
}