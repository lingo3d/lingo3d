import scene from "../engine/scene"
import {
    BufferAttribute,
    BufferGeometry,
    CatmullRomCurve3,
    Line,
    LineBasicMaterial,
    Vector3
} from "three"
import { scaleDown } from "../engine/constants"
import { vector3 } from "../display/utils/reusables"

export default {}

const points = [
    new Vector3(289, 452, 56),
    new Vector3(-53, 171, -14),
    new Vector3(-91, 176, -6),
    new Vector3(-383, 491, 47)
].map(({ x, y, z }) => new Vector3(x * scaleDown, y * scaleDown, z * scaleDown))

const ARC_SEGMENTS = 50

const geometry = new BufferGeometry()
const position = new BufferAttribute(new Float32Array(ARC_SEGMENTS * 3), 3)
geometry.setAttribute("position", position)

const curve = new CatmullRomCurve3(points, undefined, "catmullrom", 0.5)
const curveMesh = new Line(
    geometry,
    new LineBasicMaterial({
        color: 0xff0000,
        opacity: 0.35
    })
)
scene.add(curveMesh)

updateSplineOutline()

function updateSplineOutline() {
    for (let i = 0; i < ARC_SEGMENTS; i++) {
        const t = i / (ARC_SEGMENTS - 1)
        curve.getPoint(t, vector3)
        position.setXYZ(i, vector3.x, vector3.y, vector3.z)
    }

    position.needsUpdate = true
}
