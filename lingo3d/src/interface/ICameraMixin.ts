import { camFar, camNear } from "../engine/constants"
import { MAX_POLAR_ANGLE, MIN_POLAR_ANGLE } from "../globals"
import { bokehDefault } from "../states/useBokeh"
import { bokehApertureDefault } from "../states/useBokehAperture"
import { bokehFocusDefault } from "../states/useBokehFocus"
import { bokehMaxBlurDefault } from "../states/useBokehMaxBlur"

export default interface ICameraMixin {
    fov: number
    zoom: number
    near: number
    far: number
    active: boolean
    bokeh: boolean
    bokehFocus: number
    bokehMaxBlur: number
    bokehAperture: number

    minPolarAngle: number
    maxPolarAngle: number
}

export const cameraMixinDefaults: ICameraMixin = {
    fov: 75,
    zoom: 1,
    near: camNear,
    far: camFar,
    active: false,
    bokeh: bokehDefault,
    bokehFocus: bokehFocusDefault,
    bokehMaxBlur: bokehMaxBlurDefault,
    bokehAperture: bokehApertureDefault,

    minPolarAngle: MIN_POLAR_ANGLE,
    maxPolarAngle: MAX_POLAR_ANGLE
}