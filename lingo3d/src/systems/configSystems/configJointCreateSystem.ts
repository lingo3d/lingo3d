import { Object3D } from "three"
import JointBase from "../../display/core/JointBase"
import { setPxTransform_, setPxTransform__ } from "../../engine/physx/pxMath"
import { physxPtr } from "../../pointers/physxPtr"
import createInternalSystem from "../utils/createInternalSystem"

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

export const configJointCreateSystem = createInternalSystem(
    "configJointCreateSystem",
    {
        effect: (self: JointBase) => {
            const fromManager = self.$fromManager!
            const toManager = self.$toManager!
            if (!fromManager.$actor || !toManager!.$actor) return false

            self.$pxJoint = self.$createJoint(
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
            )
        },
        cleanup: (self) => {
            physxPtr[0].destroy(self.$pxJoint)
            self.$pxJoint = undefined
        }
    }
)
