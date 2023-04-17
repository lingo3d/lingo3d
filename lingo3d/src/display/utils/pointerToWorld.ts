import { CM2M } from "../../globals"
import { LingoMouseEvent } from "../../interface/IMouse"
import { getCameraPointerLock } from "../../states/useCameraPointerLock"
import getWorldPosition from "../../utilsCached/getWorldPosition"
import normalizeClientPosition from "./normalizeClientPosition"
import { pt3d0, vector3 } from "./reusables"
import { vec2Point } from "./vec2Point"
import { cameraRenderedPtr } from "../../pointers/cameraRenderedPtr"
import Point3d from "../../math/Point3d"

export default (ev: { clientX: number; clientY: number }) => {
    const distance = 500
    const [xNorm, yNorm, canvasX, canvasY] = normalizeClientPosition(
        ev.clientX,
        ev.clientY
    )

    if (getCameraPointerLock())
        return new LingoMouseEvent(
            canvasX,
            canvasY,
            ev.clientX,
            ev.clientY,
            0,
            0,
            pt3d0,
            pt3d0,
            distance,
            undefined
        )

    const [camera] = cameraRenderedPtr
    const cameraPosition = getWorldPosition(camera)

    vector3.set(xNorm, yNorm, 0.5)
    vector3.unproject(camera)
    vector3.sub(cameraPosition).normalize()

    return new LingoMouseEvent(
        canvasX,
        canvasY,
        ev.clientX,
        ev.clientY,
        xNorm,
        yNorm,
        vec2Point(cameraPosition.add(vector3.multiplyScalar(distance * CM2M))),
        new Point3d(0, 0, 0),
        distance,
        undefined
    )
}
