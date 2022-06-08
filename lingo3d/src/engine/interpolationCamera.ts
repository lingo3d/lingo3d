import { PerspectiveCamera } from "three"
import { camFar, camNear } from "./constants"

export default new PerspectiveCamera(75, 1, camNear, camFar)