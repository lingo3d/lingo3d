import normalizeClientPosition from "../display/utils/normalizeClientPosition"
import { pt3d0, vector3 } from "../display/utils/reusables"
import { vec2Point } from "../display/utils/vec2Point"
import { CM2M } from "../globals"
import { LingoMouseEvent } from "../interface/IMouse"
import getWorldPosition from "../memo/getWorldPosition"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import throttleFrameWithArgs from "./utils/throttleFrameWithArgs"
import { cameraPointerLockPtr } from "../pointers/cameraPointerLockPtr"
import Point3d from "../math/Point3d"

export default throttleFrameWithArgs(
    (ev: { clientX: number; clientY: number }) => {
        const distance = 500
        const [xNorm, yNorm, canvasX, canvasY] = normalizeClientPosition(
            ev.clientX,
            ev.clientY
        )

        if (cameraPointerLockPtr[0])
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
            vec2Point(
                cameraPosition.add(vector3.multiplyScalar(distance * CM2M))
            ),
            new Point3d(0, 0, 0),
            distance,
            undefined
        )
    }
)
