import MeshAppendable from "../api/core/MeshAppendable"
import { LingoMouseEvent } from "./IMouse"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IVisible {
    bloom: boolean
    outline: boolean

    visible: boolean
    frustumCulled: boolean
    castShadow: boolean
    receiveShadow: boolean

    onClick: Nullable<(e: LingoMouseEvent) => void>
    onMouseDown: Nullable<(e: LingoMouseEvent) => void>
    onMouseUp: Nullable<(e: LingoMouseEvent) => void>
    onMouseOver: Nullable<(e: LingoMouseEvent) => void>
    onMouseOut: Nullable<(e: LingoMouseEvent) => void>
    onMouseMove: Nullable<(e: LingoMouseEvent) => void>
    onHit: Nullable<(instance: MeshAppendable) => void>
    onHitStart: Nullable<(instance: MeshAppendable) => void>
    onHitEnd: Nullable<(instance: MeshAppendable) => void>

    hitTarget: Nullable<
        string | Array<string> | MeshAppendable | Array<MeshAppendable>
    >
}

export const visibleSchema: Required<ExtractProps<IVisible>> = {
    bloom: Boolean,
    outline: Boolean,

    visible: Boolean,
    frustumCulled: Boolean,
    castShadow: Boolean,
    receiveShadow: Boolean,

    hitTarget: [String, Array, Object],

    onClick: Function,
    onMouseDown: Function,
    onMouseUp: Function,
    onMouseOver: Function,
    onMouseOut: Function,
    onMouseMove: Function,
    onHit: Function,
    onHitStart: Function,
    onHitEnd: Function
}

export const visibleDefaults = extendDefaults<IVisible>([], {
    bloom: false,
    outline: false,

    visible: true,
    frustumCulled: true,
    castShadow: true,
    receiveShadow: true,

    hitTarget: undefined,

    onClick: undefined,
    onMouseDown: undefined,
    onMouseUp: undefined,
    onMouseOver: undefined,
    onMouseOut: undefined,
    onMouseMove: undefined,
    onHit: undefined,
    onHitStart: undefined,
    onHitEnd: undefined
})
