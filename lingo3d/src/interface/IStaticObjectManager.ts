import { LingoMouseEvent } from "./IMouse"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import MeshAppendable from "../api/core/MeshAppendable"

export default interface IStaticObjectManager extends IAppendable {
    onClick: Nullable<(e: LingoMouseEvent) => void>
    onMouseDown: Nullable<(e: LingoMouseEvent) => void>
    onMouseUp: Nullable<(e: LingoMouseEvent) => void>
    onMouseOver: Nullable<(e: LingoMouseEvent) => void>
    onMouseOut: Nullable<(e: LingoMouseEvent) => void>
    onMouseMove: Nullable<(e: LingoMouseEvent) => void>
    onLookToEnd: Nullable<() => void>
    onHit: Nullable<(instance: MeshAppendable) => void>
    onHitStart: Nullable<(instance: MeshAppendable) => void>
    onHitEnd: Nullable<(instance: MeshAppendable) => void>

    lookAt: Function | Array<any>
    lookTo: Function | Array<any>

    name: string
    id: Nullable<string>

    hitTarget: Nullable<
        string | Array<string> | MeshAppendable | Array<MeshAppendable>
    >
}

export const staticObjectManagerSchema: Required<
    ExtractProps<IStaticObjectManager>
> = {
    ...appendableSchema,

    onClick: Function,
    onMouseDown: Function,
    onMouseUp: Function,
    onMouseOver: Function,
    onMouseOut: Function,
    onMouseMove: Function,
    onLookToEnd: Function,
    onHit: Function,
    onHitStart: Function,
    onHitEnd: Function,

    lookAt: [Function, Array],
    lookTo: [Function, Array],

    name: String,
    id: String,

    hitTarget: [String, Array, Object]
}

export const staticObjectManagerDefaults = extendDefaults<IStaticObjectManager>(
    [appendableDefaults],
    {
        onClick: undefined,
        onMouseDown: undefined,
        onMouseUp: undefined,
        onMouseOver: undefined,
        onMouseOut: undefined,
        onMouseMove: undefined,
        onLookToEnd: undefined,
        onHit: undefined,
        onHitStart: undefined,
        onHitEnd: undefined,

        lookAt: fn,
        lookTo: fn,

        name: "",
        id: undefined,

        hitTarget: undefined
    }
)
