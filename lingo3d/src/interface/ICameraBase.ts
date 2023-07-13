import { MIN_POLAR_ANGLE, MAX_POLAR_ANGLE, NEAR, FAR } from "../globals"
import IGimbalObjectManager, {
    gimbalObjectManagerDefaults,
    gimbalObjectManagerSchema
} from "./IGimbalObjectManager"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableDefault } from "./utils/NullableDefault"
import Range from "./utils/Range"

export type MouseControl = boolean | "drag"

export default interface ICameraBase extends IGimbalObjectManager {
    mouseControl: MouseControl

    fov: number
    zoom: number
    active: boolean
    transition: boolean

    minPolarAngle: number
    maxPolarAngle: number

    minAzimuthAngle: number
    maxAzimuthAngle: number

    polarAngle: Nullable<number>
    azimuthAngle: Nullable<number>

    inertia: boolean
}

export const cameraBaseSchema: Required<ExtractProps<ICameraBase>> = {
    ...gimbalObjectManagerSchema,

    mouseControl: [Boolean, String],

    fov: Number,
    zoom: Number,
    active: Boolean,
    transition: Boolean,

    minPolarAngle: Number,
    maxPolarAngle: Number,

    minAzimuthAngle: Number,
    maxAzimuthAngle: Number,

    polarAngle: Number,
    azimuthAngle: Number,

    inertia: Boolean
}

export const cameraBaseDefaults = extendDefaults<ICameraBase>(
    [gimbalObjectManagerDefaults],
    {
        mouseControl: false,

        fov: 75,
        zoom: 1,
        active: false,
        transition: false,

        minPolarAngle: MIN_POLAR_ANGLE,
        maxPolarAngle: MAX_POLAR_ANGLE,

        minAzimuthAngle: -Infinity,
        maxAzimuthAngle: Infinity,

        polarAngle: nullableDefault(0),
        azimuthAngle: nullableDefault(0),

        inertia: false
    },
    {
        mouseControl: new Choices({ true: true, false: false, drag: "drag" }),
        fov: new Range(30, 120, 5),
        zoom: new Range(0.1, 10),
        minPolarAngle: new Range(0, 180, 1),
        maxPolarAngle: new Range(0, 180, 1),
        polarAngle: new Range(0, 180),
        azimuthAngle: new Range(0, 360)
    }
)
