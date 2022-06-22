import { OrthographicCamera as ThreeOrthographicCamera } from "three"
import { camFar } from "../../engine/constants"
import { ORTHOGRAPHIC_FRUSTUM } from "../../globals"
import ICamera from "../../interface/ICamera"
import { getResolution } from "../../states/useResolution"
import CameraBase from "../core/CameraBase"

//@ts-ignore
export default class OrthographicCamera extends CameraBase<ThreeOrthographicCamera> implements ICamera {
    public constructor() {
        const [w, h] = getResolution()
        const aspect = w / h

        super(new ThreeOrthographicCamera(
            aspect * ORTHOGRAPHIC_FRUSTUM * -0.5,
            aspect * ORTHOGRAPHIC_FRUSTUM * 0.5,
            ORTHOGRAPHIC_FRUSTUM * 0.5,
            ORTHOGRAPHIC_FRUSTUM * -0.5,
            -1,
            camFar
        ))
    }
}