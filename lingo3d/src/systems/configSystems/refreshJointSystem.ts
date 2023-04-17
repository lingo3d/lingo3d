import { Object3D } from "three"
import JointBase from "../../display/core/JointBase"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { setPxTransform_, setPxTransform__ } from "../../engine/physx/pxMath"
import { TransformControlsPayload } from "../../events/onTransformControls"
import { physxPtr } from "../../pointers/physxPtr"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"
import { importPhysX } from "./refreshPhysicsSystem"
import { uuidMap } from "../../collections/uuidCollections"

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

export const [addRefreshJointSystem, deleteRefreshJointSystem] =
    configSystemWithCleanUp(
        (self: JointBase) => {
            const { to, from } = self
            const { destroy } = physxPtr[0]
            if (!destroy || !to || !from) return

            const toManager = uuidMap.get(to)
            const fromManager = uuidMap.get(from)
            if (
                !(toManager instanceof PhysicsObjectManager) ||
                !(fromManager instanceof PhysicsObjectManager)
            )
                return

            fromManager.jointCount++
            toManager.jointCount++

            const refresh0 = () => addRefreshJointSystem(self)
            const refresh1 = ({ phase }: TransformControlsPayload) =>
                phase === "end" && addRefreshJointSystem(self)

            const handle0 = fromManager.events.on("physics", refresh0)
            const handle1 = toManager.events.on("physics", refresh0)
            const handle2 = fromManager.events.on("transformControls", refresh1)
            const handle3 = toManager.events.on("transformControls", refresh1)

            const joint = (self.pxJoint = self.createJoint(
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

            self.fromManager = fromManager
            self.toManager = toManager

            return () => {
                handle0.cancel()
                handle1.cancel()
                handle2.cancel()
                handle3.cancel()
                self.pxJoint = undefined
                destroy(joint)
                fromManager.jointCount--
                toManager.jointCount--
                self.fromManager = undefined
                self.toManager = undefined
            }
        },
        [importPhysX]
    )
