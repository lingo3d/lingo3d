import { Object3D } from "three"
import JointBase from "../../display/core/JointBase"
import { setPxTransform_, setPxTransform__ } from "../../engine/physx/pxMath"
import { physxPtr } from "../../pointers/physxPtr"
import createInternalSystem from "../utils/createInternalSystem"
import { testObject } from "../../display/utils/reusables"
import fastAttach from "../../display/utils/fastAttach"

const getRelativeTransform = (
    thisObject: Object3D,
    fromObject: Object3D,
    setPxTransform: typeof setPxTransform_
) => {
    const fromScale = fromObject.scale
    testObject.position.copy(thisObject.position)
    testObject.quaternion.copy(thisObject.quaternion)
    fastAttach(fromObject, testObject)
    const fromPxTransform = setPxTransform(
        testObject.position.x * fromScale.x,
        testObject.position.y * fromScale.y,
        testObject.position.z * fromScale.z,
        testObject.quaternion.x,
        testObject.quaternion.y,
        testObject.quaternion.z,
        testObject.quaternion.w
    )
    fromObject.remove(testObject)
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
                    self.$object,
                    fromManager.$object,
                    setPxTransform_
                ),
                getRelativeTransform(
                    self.$object,
                    toManager.$object,
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
