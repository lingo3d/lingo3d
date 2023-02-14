import { Point } from "@lincode/math"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableCallback from "./utils/NullableCallback"

export default interface IJoystick extends IAppendable {
    onMove: Nullable<(position: Point) => void>
    onMoveStart: Nullable<(position: Point) => void>
    onMoveEnd: Nullable<(position: Point) => void>
    onPress: Nullable<(position: Point) => void>
}

export const joystickSchema: Required<ExtractProps<IJoystick>> = {
    ...appendableSchema,
    onMove: Function,
    onMoveStart: Function,
    onMoveEnd: Function,
    onPress: Function
}

export const joystickDefaults = extendDefaults<IJoystick>(
    [appendableDefaults],
    {
        onMove: new NullableCallback({ position: Point }),
        onMoveStart: new NullableCallback({ position: Point }),
        onMoveEnd: new NullableCallback({ position: Point }),
        onPress: new NullableCallback({ position: Point })
    }
)
