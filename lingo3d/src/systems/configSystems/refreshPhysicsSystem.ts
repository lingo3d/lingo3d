import { deg2Rad } from "@lincode/math"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import destroy from "../../display/core/PhysicsObjectManager/physx/destroy"
import { physxPtr } from "../../display/core/PhysicsObjectManager/physx/physxPtr"
import { assignPxTransform } from "../../display/core/PhysicsObjectManager/physx/pxMath"
import getActualScale from "../../display/utils/getActualScale"
import scene from "../../engine/scene"
import configMemoSystemWithCleanUpAndData from "../utils/configMemoSystemWithCleanUpAndData"
import {
    actorPtrManagerMap,
    controllerManagerMap,
    managerActorMap,
    managerControllerMap,
    pxUpdateSet
} from "../../collections/pxCollections"
import { nonStaticSet } from "../../collections/nonStaticSet"

export const [addRefreshPhysicsSystem] = configMemoSystemWithCleanUpAndData(
    (self: PhysicsObjectManager) => {
        const mode = self.physics || !!self.jointCount
        if (mode === "static" || mode === "map") nonStaticSet.delete(self)
        else nonStaticSet.add(self)
        if (!mode) return

        const {
            physics,
            pxScene,
            PxCapsuleControllerDesc,
            PxCapsuleClimbingModeEnum,
            PxControllerNonWalkableModeEnum,
            material,
            getPxControllerManager,
            controllerHitCallback
        } = physxPtr[0]

        const ogParent = self.outerObject3d.parent
        ogParent !== scene && scene.attach(self.outerObject3d)

        if (mode === "character") {
            const desc = new PxCapsuleControllerDesc()
            const { x, y } = getActualScale(self).multiplyScalar(0.5)
            self.capsuleHeight = y * 2
            desc.height = y * 1.2
            desc.radius = x
            Object.assign(desc.position, self.position)
            desc.climbingMode = PxCapsuleClimbingModeEnum.eEASY()
            desc.nonWalkableMode =
                PxControllerNonWalkableModeEnum.ePREVENT_CLIMBING()
            desc.slopeLimit = Math.cos(45 * deg2Rad)
            desc.material = material
            desc.contactOffset = 0.1
            // desc.stepOffset = y * 0.4
            // desc.maxJumpHeight = 0.1

            desc.reportCallback = controllerHitCallback
            // desc.behaviorCallback = behaviorCallback.callback
            const controller = getPxControllerManager().createController(desc)
            destroy(desc)

            const actor = self.initActor(controller.getActor())
            managerControllerMap.set(self, controller)
            controllerManagerMap.set(controller, self)

            return () => {
                actorPtrManagerMap.delete(actor.ptr)
                destroy(controller)
                managerControllerMap.delete(self)
                controllerManagerMap.delete(controller)
                pxUpdateSet.delete(self)
                self.actor = undefined
            }
        }

        const pxTransform = assignPxTransform(self)
        const isStatic = mode === "map" || mode === "static"
        const actor = self.initActor(
            isStatic
                ? physics.createRigidStatic(pxTransform)
                : physics.createRigidDynamic(pxTransform)
        )

        self.getPxShape(mode, actor)
        pxScene.addActor(actor)
        managerActorMap.set(self, actor)

        return () => {
            pxScene.removeActor(actor)
            destroy(actor)

            actorPtrManagerMap.delete(actor.ptr)
            managerActorMap.delete(self)
            pxUpdateSet.delete(self)
            self.actor = undefined
            self.emitPropertyChangedEvent("physics")
        }
    },
    (self) => {
        const mode = self.physics || !!self.jointCount
        if (self.userData.physicsMode === mode) return false
        self.userData.physicsMode = mode
        return true
    }
)
