import { createEffect } from "@lincode/reactivity"
import { forceGet } from "@lincode/utils"
import { Box3, Vector3 } from "three"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import { getBVHMap } from "../../../../states/useBVHMap"
import { getCentripetal } from "../../../../states/useCentripetal"
import { getGravity } from "../../../../states/useGravity"
import { getRepulsion } from "../../../../states/useRepulsion"
import {
    box3,
    line3,
    vector3,
    vector3_,
    vector3_0,
    vector3__
} from "../../../utils/reusables"
import bvhContactMap from "./bvhContactMap"
import getWorldPosition from "../../../utils/getWorldPosition"
import PhysicsObjectManager from ".."
import { bvhCharacterSet } from "./bvhCharacterSet"
import { bvhManagerMap } from "./bvhManagerMap"
import { fpsRatio } from "../../../../engine/eventLoop"
import { getFirstLoad } from "../../../../states/useFirstLoad"
import { getBVHComputing } from "../../../../states/useBVHComputingCount"
import { getEditorMode } from "../../../../states/useEditorMode"

const makeWeakSet = () => new WeakSet()

createEffect(
    function (this: PhysicsObjectManager) {
        if (getEditorMode() !== "play" || !getFirstLoad() || getBVHComputing())
            return

        const bvhArray = getBVHMap()
        if (!bvhArray.length) return

        const gravity = getGravity()
        const repulsion = getRepulsion()
        const delta = 0.02

        const centripetal = getCentripetal()

        const handle = onBeforeRender(() => {
            bvhContactMap.clear()

            for (const characterManager of bvhCharacterSet) {
                const playerVelocity = characterManager.bvhVelocity!
                const player = characterManager.outerObject3d
                const capsuleHalfHeight = characterManager.bvhHalfHeight!
                const capsuleRadius = centripetal
                    ? capsuleHalfHeight
                    : characterManager.bvhRadius!

                if (centripetal) {
                    playerVelocity.add(
                        characterManager.bvhOnGround ||
                            characterManager._gravity === false
                            ? vector3_0
                            : getWorldPosition(player)
                                  .normalize()
                                  .multiplyScalar(
                                      delta * -gravity * fpsRatio[0]
                                  )
                    )
                } else
                    playerVelocity.y +=
                        characterManager.bvhOnGround ||
                        characterManager._gravity === false
                            ? 0
                            : delta * -gravity * fpsRatio[0]

                const updatePosition = characterManager.positionUpdate!
                updatePosition.x && (playerVelocity.x = 0)
                updatePosition.y && (playerVelocity.y = 0)
                updatePosition.z && (playerVelocity.z = 0)
                updatePosition.reset()

                player.position.addScaledVector(playerVelocity, delta)
                player.updateMatrixWorld()

                const { start, end } = line3
                end.copy(start.copy(player.position))

                const yOffset = Math.max(capsuleHalfHeight - capsuleRadius, 0)
                end.y += yOffset
                start.y -= yOffset

                const startOld = start.clone()

                box3.setFromCenterAndSize(
                    player.position,
                    vector3__.set(
                        capsuleRadius * 2,
                        capsuleHalfHeight * 2,
                        capsuleRadius * 2
                    )
                )
                const triPoint = vector3
                const capsulePoint = vector3_
                let distance = 0
                let direction: Vector3 | undefined

                let contact = false
                let mapManager: PhysicsObjectManager | undefined

                for (const boundsTree of bvhArray) {
                    mapManager = bvhManagerMap.get(boundsTree)

                    boundsTree.shapecast({
                        intersectsBounds: (box: Box3) =>
                            box.intersectsBox(box3),
                        intersectsTriangle: (tri: any) => {
                            distance = tri.closestPointToSegment(
                                line3,
                                triPoint,
                                capsulePoint
                            )
                            if (distance < capsuleRadius) {
                                contact = true
                                direction = capsulePoint
                                    .sub(triPoint)
                                    .normalize()
                                    .multiplyScalar(capsuleRadius - distance)
                                start.add(direction)
                                end.add(direction)
                            }
                        }
                    })
                }
                if (contact && mapManager)
                    forceGet(bvhContactMap, characterManager, makeWeakSet).add(
                        mapManager
                    )

                const deltaVector = start.sub(startOld)

                if (centripetal) characterManager.bvhOnGround = contact
                else {
                    characterManager.bvhOnGround =
                        deltaVector.y >
                        Math.abs(delta * playerVelocity.y * 0.25)

                    if (
                        repulsion &&
                        characterManager.bvhOnGround &&
                        Math.abs(
                            deltaVector.y /
                                (deltaVector.x + deltaVector.z + Number.EPSILON)
                        ) < repulsion
                    )
                        characterManager.bvhOnGround = false
                }

                const offset = Math.max(0.0, deltaVector.length() - 1e-5)
                deltaVector.normalize().multiplyScalar(offset)

                player.position.add(deltaVector)

                if (!characterManager.bvhOnGround) {
                    deltaVector.normalize()
                    playerVelocity.addScaledVector(
                        deltaVector,
                        -deltaVector.dot(playerVelocity)
                    )
                } else playerVelocity.set(0, 0, 0)
            }
        })
        return () => {
            handle.cancel()
        }
    },
    [
        getBVHMap,
        getGravity,
        getRepulsion,
        getCentripetal,
        getEditorMode,
        getFirstLoad,
        getBVHComputing
    ]
)
