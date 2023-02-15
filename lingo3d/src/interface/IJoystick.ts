import { Point } from "@lincode/math"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableCallback } from "./utils/NullableCallback"

export default interface IJoystick extends IAppendable {
    onMove: Nullable<(e: Point) => void>
    onMoveStart: Nullable<(e: Point) => void>
    onMoveEnd: Nullable<(e: Point) => void>
    onPress: Nullable<(e: Point) => void>
}

export const joystickSchema: Required<ExtractProps<IJoystick>> = {
    ...appendableSchema,
    onMove: Function,
    onMoveStart: Function,
    onMoveEnd: Function,
    onPress: Function
}

const pt = new Point(0, 0)
export const joystickDefaults = extendDefaults<IJoystick>(
    [appendableDefaults],
    {
        onMove: nullableCallback(pt),
        onMoveStart: nullableCallback(pt),
        onMoveEnd: nullableCallback(pt),
        onPress: nullableCallback(pt)
    }
)
