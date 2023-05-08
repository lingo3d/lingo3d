import { OrthographicCamera as ThreeOrthographicCamera } from "three"
import { FAR, ORTHOGRAPHIC_FRUSTUM } from "../../globals"
import ICamera from "../../interface/ICamera"
import CameraBase from "../core/CameraBase"
import { resolutionPtr } from "../../pointers/resolutionPtr"

export default class OrthographicCamera
    //@ts-ignore
    extends CameraBase<ThreeOrthographicCamera>
    implements ICamera
{
    public static componentName = "orthographicCamera"
    public static defaults = {}
    public static schema = {}

    public constructor(cam?: ThreeOrthographicCamera) {
        const [[w, h]] = resolutionPtr
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
