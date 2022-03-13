import { PerspectiveCamera } from "three"
import { getCameraDistance } from "../states/useCameraDistance"
import { camFar, camNear } from "./constants"

const mainCamera = new PerspectiveCamera(75, 1, camNear, camFar)
export default mainCamera

getCameraDistance(cameraDistance => mainCamera.position.z = cameraDistance)