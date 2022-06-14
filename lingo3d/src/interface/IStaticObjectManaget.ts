import IAnimationMixin, { animationMixinDefaults, animationMixinSchema } from "./IAnimationMixin"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { LingoMouseEvent } from "./IMouse"
import { ExtractProps } from "./utils/extractProps"

export default interface IStaticObjectManager extends IEventLoop, IAnimationMixin {
    onClick?: (e: LingoMouseEvent) => void
    onMouseDown?: (e: LingoMouseEvent) => void
    onMouseUp?: (e: LingoMouseEvent) => void
    onMouseOver?: (e: LingoMouseEvent) => void
    onMouseOut?: (e: LingoMouseEvent) => void
    onMouseMove?: (e: LingoMouseEvent) => void
    
    name: string
    id?: string

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

export const staticObjectManagerDefaults: IStaticObjectManager = {
    ...eventLoopDefaults,
    ...animationMixinDefaults,

    name: "",

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