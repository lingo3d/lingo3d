import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { physxPtr } from "../../pointers/physxPtr"
import { assignPxTransform } from "../../engine/physx/pxMath"
import getActualScale from "../../memo/getActualScale"
import scene from "../../engine/scene"
import {
    actorPtrManagerMap,
    controllerManagerMap,
    managerActorMap,
    managerControllerMap
} from "../../collections/pxCollections"
import { lazy } from "@lincode/utils"
import { getPhysXLoaded } from "../../states/usePhysXLoaded"
import { physicsSet } from "../../collections/physicsSet"
import { configPhysicsTransformSystem } from "../configSystems/configPhysicsTransformSystem"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import { busyCountPtr } from "../../pointers/busyCountPtr"
import getParent from "../../display/core/utils/getParent"
import { DEG2RAD } from "three/src/math/MathUtils"

export const importPhysX = lazy(async () => {
    busyCountPtr[0]++
    await import("../../engine/physx")
    await new Promise<void>((resolve) =>
        getPhysXLoaded((loaded, handle) => {
            if (!loaded) return
            handle.cancel()
            resolve()
        })
    )
    busyCountPtr[0]--
})

export const configPhysicsShapeSystem = createLoadedEffectSystem(
    "configPhysicsShapeSystem",
    {
        effect: (self: PhysicsObjectManager) => {
            const mode = self.physics || !!self.$jointCount
            if (!mode) return false

            configPhysicsTransformSystem.delete(self)
            physicsSet.add(self)

            const {
                physics,
                pxScene,
                PxCapsuleControllerDesc,
                PxCapsuleClimbingModeEnum,
                PxControllerNonWalkableModeEnum,
                material,
                getPxControllerManager,
                controllerHitCallback,
                destroy
            } = physxPtr[0]

            const ogParent = getParent(self.$object)
            ogParent !== scene && scene.attach(self.$object)

            if (mode === "character") {
                const desc = new PxCapsuleControllerDesc()
                const { x, y } = getActualScale(self).multiplyScalar(0.5)
                self.$capsuleHeight = y * 2
                desc.height = y * 1.3
                desc.radius = x
                Object.assign(desc.position, self.position)
                desc.climbingMode = PxCapsuleClimbingModeEnum.eEASY()
                desc.nonWalkableMode =
                    PxControllerNonWalkableModeEnum.ePREVENT_CLIMBING()
                desc.slopeLimit = Math.cos(45 * DEG2RAD)
                desc.material = material
                desc.contactOffset = 0.1
                // desc.stepOffset = y * 0.4
                // desc.maxJumpHeight = 0.1

                desc.reportCallback = controllerHitCallback
                // desc.behaviorCallback = behaviorCallback.callback
                const controller = (self.$controller =
                    getPxControllerManager().createController(desc))
                destroy(desc)

                self.$initActor(controller.getActor())
                managerControllerMap.set(self, controller)
                controllerManagerMap.set(controller, self)
                return
            }
            const pxTransform = assignPxTransform(self)
            const isStatic = mode === "map" || mode === "static"
            const actor = self.$initActor(
                isStatic
                    ? physics.createRigidStatic(pxTransform)
                    : physics.createRigidDynamic(pxTransform)
            )
            self.$getPxShape(mode, actor)
            pxScene.addActor(actor)
            managerActorMap.set(self, actor)
        },
        cleanup: (self) => {
            configPhysicsTransformSystem.delete(self)
            if (self.$controller) {
                physicsSet.delete(self)
                actorPtrManagerMap.delete(self.$actor.ptr)
                physxPtr[0].destroy(self.$controller)
                managerControllerMap.delete(self)
                self.$actor = undefined
                self.$controller = undefined
                return
            }
            physicsSet.delete(self)
            physxPtr[0].pxScene.removeActor(self.$actor)
            physxPtr[0].destroy(self.$actor)
            actorPtrManagerMap.delete(self.$actor.ptr)
            managerActorMap.delete(self)
            self.$actor = undefined
        },
        effectTicker: [importPhysX]
    }
)
