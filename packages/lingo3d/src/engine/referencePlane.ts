import { Mesh, PlaneBufferGeometry } from "three"
import { diameterScaled, scaleDown } from "./constants"
import { wireframeMaterial } from "../display/utils/reusables"
import { getReferencePlane } from "../states/useReferencePlane"
import { getViewportSize } from "../states/useViewportSize"
import scene from "./scene"

export default {}

const referencePlane = new Mesh(new PlaneBufferGeometry(diameterScaled, diameterScaled, 4, 4), wireframeMaterial)

getReferencePlane(visible => visible ? scene.add(referencePlane) : scene.remove(referencePlane))
getViewportSize(([width, height]) => [referencePlane.scale.x, referencePlane.scale.y] = [width * scaleDown, height * scaleDown])