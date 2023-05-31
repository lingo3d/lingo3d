import { Object3D } from "three"
import JointBase from "../../display/core/JointBase"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { setPxTransform_, setPxTransform__ } from "../../engine/physx/pxMath"
import { physxPtr } from "../../pointers/physxPtr"
import { importPhysX } from "./configPhysicsShapeSystem"
import { uuidMap } from "../../collections/idCollections"
import { Cancellable } from "@lincode/promiselikes"
import {
    addJointTargetTransformEditSystem,
    deleteJointTargetTransformSystem
} from "../eventSystems/jointTargetTransformEditSystem"
import { configJointSystemPtr } from "../../pointers/configJointSystemPtr"
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

const getActor = (manager: PhysicsObjectManager) =>
    new Promise<any>((resolve) => {
        if (manager.$actor) {
            resolve(manager.$actor)
            return
        }
        manager.$events.once("actor", resolve)
    })

export const configJointSystem = createInternalSystem("configJointSystem", {
    data: {} as {
        handle0: Cancellable
        handle1: Cancellable
        handle2: Cancellable
    },
    effect: (self: JointBase, data) => {
        const { to, from } = self
        if (!to || !from) return false

        const toManager = uuidMap.get(to)
        const fromManager = uuidMap.get(from)
        if (
            !(toManager instanceof PhysicsObjectManager) ||
            !(fromManager instanceof PhysicsObjectManager)
        )
            return false

        fromManager.$jointCount++
        toManager.$jointCount++

        const handle = (data.handle0 = new Cancellable())
        Promise.all([getActor(fromManager), getActor(toManager)]).then(() => {
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
        })
        self.$fromManager = fromManager
        self.$toManager = toManager

        addJointTargetTransformEditSystem(self, { fromManager, toManager })

        const handleActor = () => configJointSystem.add(self)
        data.handle1 = fromManager.$events.on("actor", handleActor)
        data.handle2 = toManager.$events.on("actor", handleActor)
    },
    cleanup: (self, data) => {
        deleteJointTargetTransformSystem(self)
        data.handle0.cancel()
        data.handle1.cancel()
        data.handle2.cancel()
        self.$fromManager!.$jointCount--
        self.$toManager!.$jointCount--
        self.$fromManager = undefined
        self.$toManager = undefined
    },
    effectTicker: [importPhysX]
})

configJointSystemPtr[0] = configJointSystem
