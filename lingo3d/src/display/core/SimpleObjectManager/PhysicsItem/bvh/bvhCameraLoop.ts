import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import { Object3D } from "three"
import PhysicsItem from ".."
import { loop } from "../../../../../engine/eventLoop"
import { getBVHMap } from "../../../../../states/useBVHMap"
import { box3, line3, line3_0, vector3, vector3_, vector3__ } from "../../../../utils/reusables"

export const bvhCameraSet = new Set<Object3D>()
export const [emitBeforeCameraLoop, onBeforeCameraLoop] = event()

createEffect(function (this: PhysicsItem) {
    const bvhArray = getBVHMap()
    if (!bvhArray.length) return

    const handle = loop(() => {
        emitBeforeCameraLoop()

        for (const cam of bvhCameraSet) {
            const capsuleRadius = 0.5

            cam.updateMatrixWorld()
            const direction = cam.getWorldDirection(vector3__)

            // adjust player position based on collisions
            box3.makeEmpty()
            line3.copy(line3_0)

            // get the position of the capsule
            line3.start.applyMatrix4(cam.matrixWorld)
            line3.end.applyMatrix4(cam.matrixWorld)

            // get the axis aligned bounding box of the capsule
            box3.expandByPoint(line3.start)
            box3.expandByPoint(line3.end)

            box3.min.addScalar(-capsuleRadius)
            box3.max.addScalar(capsuleRadius)

            for (const boundsTree of bvhArray)
                boundsTree.shapecast({
                    //@ts-ignore
                    intersectsBounds: box => box.intersectsBox(box3),
                    //@ts-ignore
                    intersectsTriangle: tri => {
                        // check if the triangle is intersecting the capsule and adjust the
                        // capsule position if it is.
                        const triPoint = vector3
                        const capsulePoint = vector3_
                        const distance = tri.closestPointToSegment(line3, triPoint, capsulePoint)
                        if (distance < capsuleRadius) {
                            //@ts-ignore
                            const depth = capsuleRadius - distance
                            line3.start.addScaledVector(direction, depth)
                            line3.end.addScaledVector(direction, depth)
                        }
                    }
                })
            // check how much the capsule was moved
            const deltaVector = line3.start.sub(cam.position)

            const offset = Math.max(0.0, deltaVector.length() - 1e-5)
            deltaVector.normalize().multiplyScalar(offset)

            // adjust the player model
            cam.position.add(deltaVector)
        }
    })
    return () => {
        handle.cancel()
    }
}, [getBVHMap])