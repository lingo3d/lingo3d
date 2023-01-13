import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import { TransformControlsPhase } from "../events/onTransformControls"
import Nullable from "./utils/Nullable"
import Range from "./utils/Range"

export default interface IDirectioned {
    rotationX: number
    rotationY: number
    rotationZ: number
    rotation: number

    onRotateControl: Nullable<(phase: TransformControlsPhase) => void>
}

export const directionedSchema: Required<ExtractProps<IDirectioned>> = {
    rotationX: Number,
    rotationY: Number,
    rotationZ: Number,
    rotation: Number,

    onRotateControl: Function
}

export const directionedDefaults = extendDefaults<IDirectioned>(
    [],
    {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        rotation: 0,

        onRotateControl: undefined
    },
    {
        rotationX: new Range(0, 360),
        rotationY: new Range(0, 360),
        rotationZ: new Range(0, 360),
        rotation: new Range(0, 360)
    }
)
