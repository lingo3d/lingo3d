import { PointType } from "../typeGuards/isPoint"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IJoystick extends IAppendable {
    onMove: Nullable<(e: PointType) => void>
    onMoveStart: Nullable<(e: PointType) => void>
    onMoveEnd: Nullable<(e: PointType) => void>
    onPress: Nullable<(e: PointType) => void>
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
        onMove: undefined,
        onMoveStart: undefined,
        onMoveEnd: undefined,
        onPress: undefined
    }
)
