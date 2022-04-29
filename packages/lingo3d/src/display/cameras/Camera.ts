import { PerspectiveCamera } from "three"
import { camFar, camNear } from "../../engine/constants"
import ICamera, { cameraDefaults, cameraSchema } from "../../interface/ICamera"
import CameraBase from "../core/CameraBase"

export default class Camera extends CameraBase<PerspectiveCamera> implements ICamera {
    public static componentName = "camera"
    public static defaults = cameraDefaults
    public static schema = cameraSchema

    public constructor(camera = new PerspectiveCamera(75, 1, camNear, camFar)) {
        super(camera)
    }
}