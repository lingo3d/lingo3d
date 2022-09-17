import { createEffect } from "@lincode/reactivity"
import type { Body } from "cannon-es"
import { forceGet } from "@lincode/utils"
import { getPhysicsWorld } from "../../../../states/usePhysicsWorld"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import PhysicsObjectManager from ".."
import { getEditing } from "../../../../states/useEditing"
import { dt } from "../../../../engine/eventLoop"
import { getFirstLoad } from "../../../../states/useFirstLoad"

export const cannonSet = new Set<PhysicsObjectManager>()
export const cannonContactMap = new Map<Body, WeakSet<Body>>()
export const cannonContactBodies = new WeakSet<Body>()

const makeWeakSet = () => new WeakSet()

createEffect(
    function (this: PhysicsObjectManager) {
        if (getEditing() || !getFirstLoad()) return

        const world = getPhysicsWorld()
        if (!world) return

        const handle = onBeforeRender(() => {
            for (const item of cannonSet) {
                const body = item.cannonBody!

                if ("_mAV" in item) {
                    const { x, y, z } = item._mAV!
                    const { angularVelocity } = body

                    if (angularVelocity.x > x) angularVelocity.x = x
                    else if (angularVelocity.x < -x) angularVelocity.x = -x

                    if (angularVelocity.y > y) angularVelocity.y = y
                    else if (angularVelocity.y < -y) angularVelocity.y = -y

                    if (angularVelocity.z > z) angularVelocity.z = z
                    else if (angularVelocity.z < -z) angularVelocity.z = -z
                }

                if ("_mV" in item) {
                    const { x, y, z } = item._mV!
                    const { velocity } = body

                    if (velocity.x > x) velocity.x = x
                    else if (velocity.x < -x) velocity.x = -x

                    if (velocity.y > y) velocity.y = y
                    else if (velocity.y < -y) velocity.y = -y

                    if (velocity.z > z) velocity.z = z
                    else if (velocity.z < -z) velocity.z = -z
                }

                const updatePosition = item.positionUpdate!
                if (updatePosition.x) {
                    body.position.x = item.outerObject3d.position.x
                    body.velocity.x = 0
                    body.force.x = 0
                }
                if (updatePosition.y) {
                    body.position.y = item.outerObject3d.position.y
                    body.velocity.y = 0
                    body.force.y = 0
                }
                if (updatePosition.z) {
                    body.position.z = item.outerObject3d.position.z
                    body.velocity.z = 0
                    body.force.z = 0
                }
                updatePosition.reset()
                item.outerObject3d.position.copy(body.position as any)

                const updateRotation = item.rotationUpdate!
                if (updateRotation) {
                    if (updateRotation.x) {
                        body.angularVelocity.x = 0
                        body.torque.x = 0
                    }
                    if (updateRotation.y) {
                        body.angularVelocity.y = 0
                        body.torque.y = 0
                    }
                    if (updateRotation.z) {
                        body.angularVelocity.z = 0
                        body.torque.z = 0
                    }
                    body.quaternion.copy(item.outerObject3d.quaternion as any)
                } else
                    item.outerObject3d.quaternion.copy(body.quaternion as any)

                updateRotation.reset
            }
            world.step(dt[0])

            cannonContactMap.clear()
            for (const contact of world.contacts)
                forceGet(cannonContactMap, contact.bi, makeWeakSet).add(
                    contact.bj
                )
        })
        return () => {
            handle.cancel()
        }
    },
    [getPhysicsWorld, getEditing, getFirstLoad]
)
