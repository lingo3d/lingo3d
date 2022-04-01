import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import { Object3D } from "three"
import PhysicsItem from ".."
import { loop } from "../../../../../engine/eventLoop"
import { getBVHMap } from "../../../../../states/useBVHMap"
import { box3, line3, vector3, vector3_, vector3__ } from "../../../../utils/reusables"

export const bvhCameraSet = new Set<Object3D>()
export const [emitBeforeCameraLoop, onBeforeCameraLoop] = event()

createEffect(function (this: PhysicsItem) {
    const bvhArray = getBVHMap()
    if (!bvhArray.length) {
        const handle = loop(emitBeforeCameraLoop)
        return () => {
            handle.cancel()
        }
    }

    const handle = loop(() => {
        emitBeforeCameraLoop()

        for (const cam of bvhCameraSet) {
            const capsuleRadius = 0.5

            cam.updateMatrixWorld()
            const direction = cam.getWorldDirection(vector3__)

            const { start, end } = line3
            end.copy(start.copy(cam.position))

            box3.makeEmpty()
            box3.expandByPoint(start)
            box3.min.addScalar(-capsuleRadius)
            box3.max.addScalar(capsuleRadius)
            const triPoint = vector3
            const capsulePoint = vector3_
            let distance = 0
            let depth = 0

            for (const boundsTree of bvhArray)
                boundsTree.shapecast({
                    //@ts-ignore
                    intersectsBounds: box => box.intersectsBox(box3),
                    //@ts-ignore
                    intersectsTriangle: tri => {
                        distance = tri.closestPointToSegment(line3, triPoint, capsulePoint) as number
                        if (distance < capsuleRadius) {
                            depth = capsuleRadius - distance
                            start.addScaledVector(direction, depth)
                            end.addScaledVector(direction, depth)
                        }
                    }
                })
            const deltaVector = start.sub(cam.position)

            const offset = Math.max(0.0, deltaVector.length() - 1e-5)
            deltaVector.normalize().multiplyScalar(offset)

            cam.position.add(deltaVector)
        }
    })
    return () => {
        handle.cancel()
    }
}, [getBVHMap])