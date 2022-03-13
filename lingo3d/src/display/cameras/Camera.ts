import { PerspectiveCamera } from "three"
import { camFar, camNear } from "../../engine/constants"
import ICamera from "../../interface/ICamera"
import CameraBase from "../core/CameraBase"

export default class Camera extends CameraBase<PerspectiveCamera> implements ICamera {
    public constructor(camera = new PerspectiveCamera(75, 1, camNear, camFar)) {
        super(camera)
    }
}