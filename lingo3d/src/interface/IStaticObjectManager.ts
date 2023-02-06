import { LingoMouseEvent } from "./IMouse"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import MeshAppendable from "../api/core/MeshAppendable"
import IMeshAppendable, {
    meshAppendableDefaults,
    meshAppendableSchema
} from "./IMeshAppendable"

export default interface IStaticObjectManager extends IMeshAppendable {
    onClick: Nullable<(e: LingoMouseEvent) => void>
    onMouseDown: Nullable<(e: LingoMouseEvent) => void>
    onMouseUp: Nullable<(e: LingoMouseEvent) => void>
    onMouseOver: Nullable<(e: LingoMouseEvent) => void>
    onMouseOut: Nullable<(e: LingoMouseEvent) => void>
    onMouseMove: Nullable<(e: LingoMouseEvent) => void>
    onHit: Nullable<(instance: MeshAppendable) => void>
    onHitStart: Nullable<(instance: MeshAppendable) => void>
    onHitEnd: Nullable<(instance: MeshAppendable) => void>

    name: string
    id: Nullable<string>

    hitTarget: Nullable<
        string | Array<string> | MeshAppendable | Array<MeshAppendable>
    >
}

export const staticObjectManagerSchema: Required<
    ExtractProps<IStaticObjectManager>
> = {
    ...meshAppendableSchema,

    onClick: Function,
    onMouseDown: Function,
    onMouseUp: Function,
    onMouseOver: Function,
    onMouseOut: Function,
    onMouseMove: Function,
    onHit: Function,
    onHitStart: Function,
    onHitEnd: Function,

    name: String,
    id: String,

    hitTarget: [String, Array, Object]
}

export const staticObjectManagerDefaults = extendDefaults<IStaticObjectManager>(
    [meshAppendableDefaults],
    {
        onClick: undefined,
        onMouseDown: undefined,
        onMouseUp: undefined,
        onMouseOver: undefined,
        onMouseOut: undefined,
        onMouseMove: undefined,
        onHit: undefined,
        onHitStart: undefined,
        onHitEnd: undefined,

        name: "",
        id: undefined,

        hitTarget: undefined
    }
)
