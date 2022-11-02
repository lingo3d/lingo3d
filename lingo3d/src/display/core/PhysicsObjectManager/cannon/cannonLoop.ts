import { createEffect } from "@lincode/reactivity"
import { forceGet } from "@lincode/utils"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import PhysicsObjectManager from ".."
import { getEditing } from "../../../../states/useEditing"
import { dt } from "../../../../engine/eventLoop"
import { getFirstLoad } from "../../../../states/useFirstLoad"
import { getGravity } from "../../../../states/useGravity"
import {
    World,
    GSSolver,
    SplitSolver,
    NaiveBroadphase,
    Material,
    ContactMaterial,
    Body,
    Vec3
} from "cannon-es"
import { cannonContactMap, cannonSet } from "./cannonCollections"

export const world = new World()
getGravity((gravity) => world.gravity.set(0, -gravity, 0))

world.quatNormalizeSkip = 0
world.quatNormalizeFast = false

const solver = new GSSolver()

world.defaultContactMaterial.contactEquationStiffness = 1e9
world.defaultContactMaterial.contactEquationRelaxation = 4

solver.iterations = 7
solver.tolerance = 0.1
const split = true
if (split) world.solver = new SplitSolver(solver)
else world.solver = solver

world.broadphase = new NaiveBroadphase()

export const [defaultMaterial] = world.defaultContactMaterial.materials
export const slipperyMaterial = new Material("slipperyMaterial")

world.addContactMaterial(
    new ContactMaterial(slipperyMaterial, slipperyMaterial, {
        friction: 0.0,
        restitution: 0.0
    })
)
world.addContactMaterial(
    new ContactMaterial(slipperyMaterial, defaultMaterial, {
        friction: 0.001,
        restitution: 0.0
    })
)

const makeWeakSet = () => new WeakSet()

createEffect(
    function (this: PhysicsObjectManager) {
        if (getEditing() || !getFirstLoad()) return

        const handle = onBeforeRender(() => {
            for (const item of cannonSet) {
                const body = item.cannonBody!

                if (item._mAV) {
                    const { x, y, z } = item._mAV
                    const { angularVelocity } = body

                    if (angularVelocity.x > x) angularVelocity.x = x
                    else if (angularVelocity.x < -x) angularVelocity.x = -x

                    if (angularVelocity.y > y) angularVelocity.y = y
                    else if (angularVelocity.y < -y) angularVelocity.y = -y

                    if (angularVelocity.z > z) angularVelocity.z = z
                    else if (angularVelocity.z < -z) angularVelocity.z = -z
                }

                if (item._mV) {
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
    [getEditing, getFirstLoad]
)
