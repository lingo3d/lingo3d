import { createEffect } from "@lincode/reactivity"
import { Vector3 } from "three"
import PhysicsItem from ".."
import { loop } from "../../../../../engine/eventLoop"
import { GRAVITY } from "../../../../../globals"
import { getBVHMap } from "../../../../../states/useBVHMap"
import { box3, line3, vector3, vector3_, vector3__ } from "../../../../utils/reusables"

export const bvhCharacterSet = new Set<PhysicsItem>()

createEffect(function (this: PhysicsItem) {
    const bvhArray = getBVHMap()
    if (!bvhArray.length) return

    const delta = 0.02

    const handle = loop(() => {
        for (const item of bvhCharacterSet) {
            const playerVelocity = item.bvhVelocity!
            const player = item.outerObject3d
            const capsuleHeight = item.bvhHeight!
            const capsuleRadius = item.bvhRadius!
            const coeff = item.bvhCoeff!

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

            const { start, end } = line3
            end.copy(start.copy(player.position))
            end.y += capsuleHeight * coeff
            start.y -= capsuleHeight * coeff
            
            const startOld = start.clone()

            box3.setFromCenterAndSize(player.position, vector3__.set(capsuleRadius * 2, capsuleHeight * 2, capsuleRadius * 2))
            const triPoint = vector3
            const capsulePoint = vector3_
            let distance = 0
            let direction: Vector3 | undefined

            for (const boundsTree of bvhArray)
                boundsTree.shapecast({
                    //@ts-ignore
                    intersectsBounds: box => box.intersectsBox(box3),
                    //@ts-ignore
                    intersectsTriangle: tri => {
                        distance = tri.closestPointToSegment(line3, triPoint, capsulePoint) as number
                        if (distance < capsuleRadius) {
                            direction = capsulePoint.sub(triPoint).normalize().multiplyScalar(capsuleRadius - distance)
                            start.add(direction)
                            end.add(direction)
                        }
                    }
                })
            const deltaVector = start.sub(startOld)

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