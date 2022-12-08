import { PerspectiveCamera } from "three"
import { FAR, NEAR } from "../../globals"
import ICamera, { cameraDefaults, cameraSchema } from "../../interface/ICamera"
import CameraBase from "../core/CameraBase"

export default class Camera extends CameraBase implements ICamera {
    public static componentName = "camera"
    public static defaults = cameraDefaults
    public static schema = cameraSchema

    public constructor() {
        super(new PerspectiveCamera(75, 1, NEAR, FAR))
    }
}
