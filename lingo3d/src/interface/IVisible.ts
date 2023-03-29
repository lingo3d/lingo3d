import { Point3d } from "@lincode/math"
import MeshAppendable from "../api/core/MeshAppendable"
import { lingoMouseEvent, LingoMouseEvent } from "./IMouse"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableCallback } from "./utils/NullableCallback"
import { nullableDefault } from "./utils/NullableDefault"

export class HitEvent {
    public constructor(
        public target: MeshAppendable,
        public point?: Point3d,
        public normal?: Point3d
    ) {}
}
export const hitEvent = new HitEvent(undefined as any)

export default interface IVisible {
    bloom: boolean
    outline: boolean

    visible: Nullable<boolean>
    reflectionVisible: Nullable<boolean>
    castShadow: Nullable<boolean>
    receiveShadow: Nullable<boolean>

    onClick: Nullable<(e: LingoMouseEvent) => void>
    onMouseDown: Nullable<(e: LingoMouseEvent) => void>
    onMouseUp: Nullable<(e: LingoMouseEvent) => void>
    onMouseOver: Nullable<(e: LingoMouseEvent) => void>
    onMouseOut: Nullable<(e: LingoMouseEvent) => void>
    onMouseMove: Nullable<(e: LingoMouseEvent) => void>
    onHit: Nullable<(e: HitEvent) => void>
    onHitStart: Nullable<(e: HitEvent) => void>
    onHitEnd: Nullable<(e: HitEvent) => void>

    hitTarget: Nullable<
        string | Array<string> | MeshAppendable | Array<MeshAppendable>
    >
}

export const visibleSchema: Required<ExtractProps<IVisible>> = {
    bloom: Boolean,
    outline: Boolean,

    visible: Boolean,
    reflectionVisible: Boolean,
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

    visible: nullableDefault(true),
    reflectionVisible: nullableDefault(false),
    castShadow: nullableDefault(true),
    receiveShadow: nullableDefault(true),

    hitTarget: undefined,

    onClick: nullableCallback(lingoMouseEvent),
    onMouseDown: nullableCallback(lingoMouseEvent),
    onMouseUp: nullableCallback(lingoMouseEvent),
    onMouseOver: nullableCallback(lingoMouseEvent),
    onMouseOut: nullableCallback(lingoMouseEvent),
    onMouseMove: nullableCallback(lingoMouseEvent),
    onHit: nullableCallback(hitEvent),
    onHitStart: nullableCallback(hitEvent),
    onHitEnd: nullableCallback(hitEvent)
})
