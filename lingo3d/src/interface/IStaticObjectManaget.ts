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
    onLookToEnd: Nullable<() => void>
    
    name: string
    id: Nullable<string>

    bloom: boolean
    reflection: boolean
    outline: boolean

    visible: boolean
    frustumCulled: boolean

    metalnessFactor: Nullable<number>
    roughnessFactor: Nullable<number>
    opacityFactor: Nullable<number>
    emissiveIntensityFactor: Nullable<number>
    emissiveColorFactor: Nullable<string>
    colorFactor: Nullable<string>

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
    onLookToEnd: Function,

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
    emissiveIntensityFactor: Number,
    emissiveColorFactor: String,
    colorFactor: String,

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
    onLookToEnd: undefined,

    name: "",
    id: undefined,

    bloom: false,
    reflection: false,
    outline: false,

    visible: true,
    frustumCulled: true,

    metalnessFactor: [undefined, 0],
    roughnessFactor: [undefined, 1],
    opacityFactor: [undefined, 1],
    emissiveIntensityFactor: [undefined, 1],
    emissiveColorFactor: [undefined, "#000000"],
    colorFactor: [undefined, "#ffffff"],

    toon: false,
    pbr: false
}