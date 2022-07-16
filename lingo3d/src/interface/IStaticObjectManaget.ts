import IAnimationMixin, { animationMixinDefaults, animationMixinSchema } from "./IAnimationMixin"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { LingoMouseEvent } from "./IMouse"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"

export default interface IStaticObjectManager extends IEventLoop, IAnimationMixin {
    onClick: Nullable<(e: LingoMouseEvent) => void>
    onMouseDown: Nullable<(e: LingoMouseEvent) => void>
    onMouseUp: Nullable<(e: LingoMouseEvent) => void>
    onMouseOver: Nullable<(e: LingoMouseEvent) => void>
    onMouseOut: Nullable<(e: LingoMouseEvent) => void>
    onMouseMove: Nullable<(e: LingoMouseEvent) => void>
    onLookToEnd: Nullable<() => void>
    
    lookAt: Function | Array<any>,
    lookTo: Function | Array<any>,

    name: string
    id: Nullable<string>

    bloom: boolean
    outline: boolean

    visible: boolean
    frustumCulled: boolean

    metalnessFactor: Nullable<number>
    roughnessFactor: Nullable<number>
    opacityFactor: Nullable<number>
    emissiveIntensityFactor: Nullable<number>
    adjustEmissiveColor: Nullable<string>
    adjustColor: Nullable<string>

    toon: boolean
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

    lookAt: [Function, Array],
    lookTo: [Function, Array],

    name: String,
    id: String,

    bloom: Boolean,
    outline: Boolean,

    visible: Boolean,
    frustumCulled: Boolean,

    metalnessFactor: Number,
    roughnessFactor: Number,
    opacityFactor: Number,
    emissiveIntensityFactor: Number,
    adjustEmissiveColor: String,
    adjustColor: String,

    toon: Boolean
}

hideSchema(["lookAt", "lookTo"])

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

    lookAt: fn,
    lookTo: fn,

    name: "",
    id: undefined,

    bloom: false,
    outline: false,

    visible: true,
    frustumCulled: true,

    metalnessFactor: [undefined, 0],
    roughnessFactor: [undefined, 1],
    opacityFactor: [undefined, 1],
    emissiveIntensityFactor: [undefined, 1],
    adjustEmissiveColor: [undefined, "#000000"],
    adjustColor: [undefined, "#ffffff"],

    toon: false
}