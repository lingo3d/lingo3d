import { OrthographicCamera } from "three"
import { camFar } from "../../engine/constants"
import ICamera from "../../interface/ICamera"
import { getResolution } from "../../states/useResolution"
import CameraBase from "../core/CameraBase"

export const frustum = 5.7

export default class extends CameraBase<OrthographicCamera> implements ICamera {
    public constructor() {
        const [w, h] = getResolution()
        const aspect = w / h

        super(new OrthographicCamera(
            aspect * frustum * -0.5, aspect * frustum * 0.5, frustum * 0.5, frustum * -0.5, -1, camFar
        ))
    }
}