import { createEffect } from "@lincode/reactivity"
import PhysicsItem from ".."
import { loop } from "../../../../../engine/eventLoop"
import { GRAVITY } from "../../../../../globals"
import { getBVHMap } from "../../../../../states/useBVHMap"
import { box3, line3, line3_0, vector3, vector3_ } from "../../../../utils/reusables"

export const bvhCharacterSet = new Set<PhysicsItem>()

createEffect(function (this: PhysicsItem) {
    const bvhArray = getBVHMap()
    if (!bvhArray.length) return

    const delta = 0.02

    const handle = loop(() => {
        for (const item of bvhCharacterSet) {
            const playerVelocity = item.bvhVelocity!
            const player = item.outerObject3d
            const capsuleRadius = item.bvhRadius!

            playerVelocity.y += item.bvhOnGround ? 0 : delta * -GRAVITY

            const { position } = item.physicsUpdate!
            item.physicsUpdate = {}

            if (position) {
                position.x && (playerVelocity.x = 0)
                position.y && (playerVelocity.y = 0)
                position.z && (playerVelocity.z = 0)
            }

            player.position.addScaledVector(playerVelocity, delta)
            player.updateMatrixWorld()

            // adjust player position based on collisions
            box3.makeEmpty()
            line3.copy(line3_0)

            // get the position of the capsule
            line3.start.applyMatrix4(player.matrixWorld)
            line3.end.applyMatrix4(player.matrixWorld)

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
                            const direction = capsulePoint.sub(triPoint).normalize()
                            line3.start.addScaledVector(direction, depth)
                            line3.end.addScaledVector(direction, depth)
                        }
                    }
                })
            // check how much the capsule was moved
            const deltaVector = line3.start.sub(player.position)

            // if the player was primarily adjusted vertically we assume it's on something we should consider ground
            item.bvhOnGround = deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25)

            const offset = Math.max(0.0, deltaVector.length() - 1e-5)
            deltaVector.normalize().multiplyScalar(offset)

            // adjust the player model
            player.position.add(deltaVector)

            if (!item.bvhOnGround) {
                deltaVector.normalize()
                playerVelocity.addScaledVector(deltaVector, -deltaVector.dot(playerVelocity))
            }
            else playerVelocity.set(0, 0, 0)
        }
    })
    return () => {
        handle.cancel()
    }
}, [getBVHMap])