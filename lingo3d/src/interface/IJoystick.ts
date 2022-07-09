import { Point } from "@lincode/math"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IJoystick extends IEventLoop {
    onMove: Nullable<(e: Point) => void>
    onMoveStart: Nullable<(e: Point) => void>
    onMoveEnd: Nullable<(e: Point) => void>
    onPress: Nullable<(e: Point) => void>
}

export const joystickSchema: Required<ExtractProps<IJoystick>> = {
    ...eventLoopSchema,
    onMove: Function,
    onMoveStart: Function,
    onMoveEnd: Function,
    onPress: Function
}

export const joystickDefaults: Defaults<IJoystick> = {
    ...eventLoopDefaults,
    onMove: undefined,
    onMoveStart: undefined,
    onMoveEnd: undefined,
    onPress: undefined
}