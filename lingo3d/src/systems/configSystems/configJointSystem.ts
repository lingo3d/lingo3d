import { Object3D } from "three"
import JointBase from "../../display/core/JointBase"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { setPxTransform_, setPxTransform__ } from "../../engine/physx/pxMath"
import { physxPtr } from "../../pointers/physxPtr"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"
import { importPhysX } from "./refreshPhysicsSystem"
import { uuidMap } from "../../collections/uuidCollections"
import { Cancellable } from "@lincode/promiselikes"
import { TransformControlsPayload } from "../../events/onTransformControls"

const getRelativeTransform = (
    thisObject: Object3D,
    fromObject: Object3D,
    setPxTransform: typeof setPxTransform_
) => {
    const fromScale = fromObject.scale
    const clone = new Object3D()
    clone.position.copy(thisObject.position)
    clone.quaternion.copy(thisObject.quaternion)
    fromObject.attach(clone)
    const fromPxTransform = setPxTransform(
        clone.position.x * fromScale.x,
        clone.position.y * fromScale.y,
        clone.position.z * fromScale.z,
        clone.quaternion.x,
        clone.quaternion.y,
        clone.quaternion.z,
        clone.quaternion.w
    )
    fromObject.remove(clone)
    return fromPxTransform
}

const getActor = (manager: PhysicsObjectManager) =>
    new Promise<any>((resolve) => {
        if (manager.$actor) {
            resolve(manager.$actor)
            return
        }
        manager.events.once("actor", resolve)
    })

export const [addConfigJointSystem, deleteConfigJointSystem] =
    configSystemWithCleanUp(
        (self: JointBase) => {
            const { to, from } = self
            if (!to || !from) return

            const toManager = uuidMap.get(to)
            const fromManager = uuidMap.get(from)
            if (
                !(toManager instanceof PhysicsObjectManager) ||
                !(fromManager instanceof PhysicsObjectManager)
            )
                return

            fromManager.$jointCount++
            toManager.$jointCount++

            const handle = new Cancellable()
            Promise.all([getActor(fromManager), getActor(toManager)]).then(
                () => {
                    if (handle.done) return
                    const joint = (self.$pxJoint = self.$createJoint(
                        getRelativeTransform(
                            self.outerObject3d,
                            fromManager.outerObject3d,
                            setPxTransform_
                        ),
                        getRelativeTransform(
                            self.outerObject3d,
                            toManager.outerObject3d,
                            setPxTransform__
                        ),
                        fromManager,
                        toManager
                    ))
                    handle.then(() => {
                        physxPtr[0].destroy(joint)
                        self.$pxJoint = undefined
                    })
                }
            )
            self.$fromManager = fromManager
            self.$toManager = toManager

            const handleTransformControls = (e: TransformControlsPayload) =>
                e.phase === "end" && addConfigJointSystem(self)

            const handle0 = fromManager.events.on(
                "transformControls",
                handleTransformControls
            )
            const handle1 = toManager.events.on(
                "transformControls",
                handleTransformControls
            )
            const handle2 = self.events.on(
                "transformControls",
                handleTransformControls
            )
            const handleActor = () => addConfigJointSystem(self)
            const handle3 = fromManager.events.on("actor", handleActor)
            const handle4 = toManager.events.on("actor", handleActor)

            return () => {
                handle0.cancel()
                handle1.cancel()
                handle2.cancel()
                handle3.cancel()
                handle4.cancel()
                handle.cancel()
                fromManager.$jointCount--
                toManager.$jointCount--
                self.$fromManager = undefined
                self.$toManager = undefined
            }
        },
        [importPhysX]
    )
