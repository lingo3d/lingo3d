import { createEffect } from "@lincode/reactivity"
import { Vector3, Box3, Line3 } from "three"
import PhysicsItem from ".."
import { loop } from "../../../../../engine/eventLoop"
import { GRAVITY } from "../../../../../globals"
import { getBVHMap } from "../../../../../states/useBVHMap"

export const bvhCharacterSet = new Set<PhysicsItem>()

createEffect(function (this: PhysicsItem) {
    const bvhArray = getBVHMap()
    if (!bvhArray.length) return

    const tempVector = new Vector3()
    const tempVector2 = new Vector3()
    const tempBox = new Box3()
    const tempSegment = new Line3()
    const delta = 0.02

    const emptySegment = new Line3(new Vector3(), new Vector3())

    const handle = loop(() => {
        for (const item of bvhCharacterSet) {
            const playerVelocity = item.bvhVelocity!
            const player = item.outerObject3d
            const capsuleRadius = item.bvhRadius!

            playerVelocity.y += item.bvhOnGround ? 0 : delta * -GRAVITY
            player.position.addScaledVector(playerVelocity, delta)

            player.updateMatrixWorld()

            // adjust player position based on collisions
            tempBox.makeEmpty()
            tempSegment.copy(emptySegment)

            // get the position of the capsule
            tempSegment.start.applyMatrix4(player.matrixWorld)
            tempSegment.end.applyMatrix4(player.matrixWorld)

            // get the axis aligned bounding box of the capsule
            tempBox.expandByPoint(tempSegment.start)
            tempBox.expandByPoint(tempSegment.end)

            tempBox.min.addScalar(-capsuleRadius)
            tempBox.max.addScalar(capsuleRadius)

            for (const boundsTree of bvhArray)
                boundsTree.shapecast({
                    //@ts-ignore
                    intersectsBounds: box => box.intersectsBox(tempBox),
                    //@ts-ignore
                    intersectsTriangle: tri => {
                        // check if the triangle is intersecting the capsule and adjust the
                        // capsule position if it is.
                        const triPoint = tempVector
                        const capsulePoint = tempVector2
                        //@ts-ignore
                        const distance = tri.closestPointToSegment(tempSegment, triPoint, capsulePoint)
                        if (distance < capsuleRadius) {
                            const depth = capsuleRadius - distance
                            const direction = capsulePoint.sub(triPoint).normalize()
                            tempSegment.start.addScaledVector(direction, depth)
                            tempSegment.end.addScaledVector(direction, depth)
                        }
                    }
                })
            // check how much the capsule was moved
            const deltaVector = tempSegment.start.sub(player.position)

            // if the player was primarily adjusted vertically we assume it's on something we should consider ground
            item.bvhOnGround = deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25)

            const offset = Math.max(0.0, deltaVector.length() - 1e-5)
            deltaVector.normalize().multiplyScalar(offset)

            // adjust the player model
            player.position.add(deltaVector)

            if (!item.bvhOnGround) {
                deltaVector.normalize()
                playerVelocity.addScaledVector(deltaVector, - deltaVector.dot(playerVelocity))
            }
            else playerVelocity.set(0, 0, 0)
        }
    })
    return () => {
        handle.cancel()
    }
}, [getBVHMap])