import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { LingoMouseEvent } from "./IMouse"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"

export default interface IStaticObjectManager extends IEventLoop {
    onClick: Nullable<(e: LingoMouseEvent) => void>
    onMouseDown: Nullable<(e: LingoMouseEvent) => void>
    onMouseUp: Nullable<(e: LingoMouseEvent) => void>
    onMouseOver: Nullable<(e: LingoMouseEvent) => void>
    onMouseOut: Nullable<(e: LingoMouseEvent) => void>
    onMouseMove: Nullable<(e: LingoMouseEvent) => void>
    onLookToEnd: Nullable<() => void>

    lookAt: Function | Array<any>
    lookTo: Function | Array<any>

    name: string
    id: Nullable<string>

    bloom: boolean
    outline: boolean

    visible: boolean
    frustumCulled: boolean
    castShadow: boolean
    receiveShadow: boolean

    metalnessFactor: Nullable<number>
    roughnessFactor: Nullable<number>
    opacityFactor: Nullable<number>
    adjustColor: Nullable<string>
    reflection: boolean

    toon: boolean
}

export const staticObjectManagerSchema: Required<
    ExtractProps<IStaticObjectManager>
> = {
    ...eventLoopSchema,

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
    castShadow: Boolean,
    receiveShadow: Boolean,

    metalnessFactor: Number,
    roughnessFactor: Number,
    opacityFactor: Number,
    adjustColor: String,
    reflection: Boolean,

    toon: Boolean
}
hideSchema(["lookAt", "lookTo"])

export const staticObjectManagerDefaults: Defaults<IStaticObjectManager> = {
    ...eventLoopDefaults,

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
    castShadow: true,
    receiveShadow: true,

    metalnessFactor: new NullableDefault(0),
    roughnessFactor: new NullableDefault(1),
    opacityFactor: new NullableDefault(1),
    adjustColor: new NullableDefault("#ffffff"),
    reflection: false,

    toon: false
}
