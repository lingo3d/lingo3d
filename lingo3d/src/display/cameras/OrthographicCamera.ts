import { OrthographicCamera as ThreeOrthographicCamera } from "three"
import { FAR, ORTHOGRAPHIC_FRUSTUM } from "../../globals"
import ICamera from "../../interface/ICamera"
import { getResolution } from "../../states/useResolution"
import CameraBase from "../core/CameraBase"

export default class OrthographicCamera
    //@ts-ignore
    extends CameraBase<ThreeOrthographicCamera>
    implements ICamera
{
    public componentName = "orthographicCamera"
    public static defaults = {}
    public static schema = {}

    public constructor(cam?: ThreeOrthographicCamera) {
        const [w, h] = getResolution()
        const aspect = w / h

        super(
            cam ??
                new ThreeOrthographicCamera(
                    aspect * ORTHOGRAPHIC_FRUSTUM * -0.5,
                    aspect * ORTHOGRAPHIC_FRUSTUM * 0.5,
                    ORTHOGRAPHIC_FRUSTUM * 0.5,
                    ORTHOGRAPHIC_FRUSTUM * -0.5,
                    -1,
                    FAR
                )
        )
    }
}
