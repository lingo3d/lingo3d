import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"
import { TransformControlsPhase } from "../events/onTransformControls"

export default interface IPositioned {
    x: number
    y: number
    z: number
    onMove: Nullable<() => void>
    onTranslateControl: Nullable<(phase: TransformControlsPhase) => void>
}

export const positionedSchema: Required<ExtractProps<IPositioned>> = {
    x: Number,
    y: Number,
    z: Number,
    onMove: Function,
    onTranslateControl: Function
}

export const positionedDefaults = extendDefaults<IPositioned>([], {
    x: 0,
    y: 0,
    z: 0,
    onMove: undefined,
    onTranslateControl: undefined
})
