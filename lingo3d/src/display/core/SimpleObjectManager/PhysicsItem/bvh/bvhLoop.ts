import { createEffect } from "@lincode/reactivity"
import { forceGet } from "@lincode/utils"
import { Vector3 } from "three"
import PhysicsItem from ".."
import { loop } from "../../../../../engine/eventLoop"
import { GRAVITY } from "../../../../../globals"
import { getBVHMap } from "../../../../../states/useBVHMap"
import { box3, line3, vector3, vector3_, vector3__ } from "../../../../utils/reusables"
import { bvhManagerMap } from "../enableBVHMap"
import bvhContactMap from "./bvhContactMap"

export const bvhCharacterSet = new Set<PhysicsItem>()

const makeWeakSet = () => new WeakSet()

createEffect(function (this: PhysicsItem) {
    const bvhArray = getBVHMap()
    if (!bvhArray.length) return

    const delta = 0.02

    const handle = loop(() => {
        bvhContactMap.clear()

        for (const characterManager of bvhCharacterSet) {
            const playerVelocity = characterManager.bvhVelocity!
            const player = characterManager.outerObject3d
            const capsuleHalfHeight = characterManager.bvhHalfHeight!
            const capsuleRadius = characterManager.bvhRadius!

            playerVelocity.y += characterManager.bvhOnGround ? 0 : delta * -GRAVITY

            const { position } = characterManager.physicsUpdate!
            characterManager.physicsUpdate = {}

            if (position) {
                position.x && (playerVelocity.x = 0)
                position.y && (playerVelocity.y = 0)
                position.z && (playerVelocity.z = 0)
            }

            player.position.addScaledVector(playerVelocity, delta)
            player.updateMatrixWorld()

            const { start, end } = line3
            end.copy(start.copy(player.position))

            const yOffset = Math.max(capsuleHalfHeight - capsuleRadius, 0)
            end.y += yOffset
            start.y -= yOffset
            
            const startOld = start.clone()

            box3.setFromCenterAndSize(player.position, vector3__.set(capsuleRadius * 2, capsuleHalfHeight * 2, capsuleRadius * 2))
            const triPoint = vector3
            const capsulePoint = vector3_
            let distance = 0
            let direction: Vector3 | undefined

            let contact = false
            let mapManager: PhysicsItem | undefined

            for (const boundsTree of bvhArray) {
                mapManager = bvhManagerMap.get(boundsTree)

                boundsTree.shapecast({
                    //@ts-ignore
                    intersectsBounds: box => box.intersectsBox(box3),
                    //@ts-ignore
                    intersectsTriangle: tri => {
                        distance = tri.closestPointToSegment(line3, triPoint, capsulePoint) as number
                        if (distance < capsuleRadius) {
                            contact = true
                            direction = capsulePoint.sub(triPoint).normalize().multiplyScalar(capsuleRadius - distance)
                            start.add(direction)
                            end.add(direction)
                        }
                    }
                })
            }
            if (contact && mapManager)
                forceGet(bvhContactMap, characterManager, makeWeakSet).add(mapManager)

            const deltaVector = start.sub(startOld)

            // if the player was primarily adjusted vertically we assume it's on something we should consider ground
            characterManager.bvhOnGround = deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25)

            const offset = Math.max(0.0, deltaVector.length() - 1e-5)
            deltaVector.normalize().multiplyScalar(offset)

            // adjust the player model
            player.position.add(deltaVector)

            if (!characterManager.bvhOnGround) {
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