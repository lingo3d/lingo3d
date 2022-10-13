import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { LingoMouseEvent } from "./IMouse"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"

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
    id: String
}

export const staticObjectManagerDefaults = extendDefaults<IStaticObjectManager>(
    [
        eventLoopDefaults,
        {
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
            id: undefined
        }
    ]
)
