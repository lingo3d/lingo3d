import { Raycaster, Object3D } from "three"
import StaticObjectManager from ".."
import { MouseEventName, mouseEvents } from "../../../../api/mouse"
import { scaleUp } from "../../../../engine/constants"
import { LingoMouseEvent } from "../../../../interface/IMouse"
import { getCameraRendered } from "../../../../states/useCameraRendered"
import { vec2Point } from "../../../utils/vec2Point"

const raycaster = new Raycaster()

const raycast = (x: number, y: number, candidates: Set<Object3D>) => {
    raycaster.setFromCamera({ x, y }, getCameraRendered())
    return raycaster.intersectObjects([...candidates])[0]
}

type Then = (obj: StaticObjectManager, e: LingoMouseEvent) => void

export default (
    name: MouseEventName | Array<MouseEventName>,
    candidates: Set<Object3D>,
    then: Then
) =>
    mouseEvents.on(name, (e) => {
        if (!candidates.size) return

        const result = raycast(e.xNorm, e.yNorm, candidates)
        if (!result) return

        const point = vec2Point(result.point)
        const distance = result.distance * scaleUp

        then(
            result.object.userData.manager,
            new LingoMouseEvent(
                e.clientX,
                e.clientY,
                e.xNorm,
                e.yNorm,
                point,
                distance,
                result.object.userData.manager
            )
        )
    })
