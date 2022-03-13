import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { Vector3, Box3, Matrix4, Line3 } from "three"
import PhysicsItem from "."
import { loop } from "../../../../engine/eventLoop"
import { GRAVITY } from "../../../../globals"
import { getBVH } from "../../../../states/useBVH"
import getActualScale from "../../../utils/getActualScale"

export default function (this: PhysicsItem, handle: Cancellable) {
    handle.watch(createEffect(() => {
        const bvh = getBVH()
        if (!bvh) return

        const [boundsTree, collider] = bvh

        let playerIsOnGround = false
        const player = this.outerObject3d
        const playerVelocity = this.bvhVelocity = new Vector3()
        const tempVector = new Vector3()
        const tempVector2 = new Vector3()
        const tempBox = new Box3()
        const tempMat = new Matrix4()
        const tempSegment = new Line3()
        const delta = 0.02

        const actualScale = getActualScale(this)
        const capsuleRadius = actualScale.y * 0.5

        const emptySegment = new Line3(new Vector3(), new Vector3())

        const handle = loop(() => {
            playerVelocity.y += playerIsOnGround ? 0 : delta * -GRAVITY
            player.position.addScaledVector(playerVelocity, delta)

            player.updateMatrixWorld()

            // adjust player position based on collisions
            tempBox.makeEmpty()
            tempMat.copy(collider.matrixWorld).invert()
            tempSegment.copy(emptySegment)

            // get the position of the capsule in the local space of the collider
            tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)
            tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)

            // get the axis aligned bounding box of the capsule
            tempBox.expandByPoint(tempSegment.start)
            tempBox.expandByPoint(tempSegment.end)

            tempBox.min.addScalar(-capsuleRadius)
            tempBox.max.addScalar(capsuleRadius)

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
            // get the adjusted position of the capsule collider in world space after checking
            // triangle collisions and moving it. tempSegment.start is assumed to be
            // the origin of the player model.
            const newPosition = tempVector
            newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld)

            // check how much the collider was moved
            const deltaVector = tempVector2
            deltaVector.subVectors(newPosition, player.position)

            // if the player was primarily adjusted vertically we assume it's on something we should consider ground
            playerIsOnGround = deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25)

            const offset = Math.max(0.0, deltaVector.length() - 1e-5)
            deltaVector.normalize().multiplyScalar(offset)

            // adjust the player model
            player.position.add(deltaVector)

            if (!playerIsOnGround) {
                deltaVector.normalize()
                playerVelocity.addScaledVector(deltaVector, - deltaVector.dot(playerVelocity))
            }
            else playerVelocity.set(0, 0, 0)
        })
        return () => {
            handle.cancel()
        }
    }, [getBVH]))
}