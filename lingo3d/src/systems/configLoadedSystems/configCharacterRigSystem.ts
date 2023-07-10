import { uuidMap } from "../../collections/idCollections"
import CharacterRig from "../../display/CharacterRig"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import { vector3 } from "../../display/utils/reusables"
import { Point3dType } from "../../typeGuards/isPoint"
import RigJoint from "../../display/CharacterRig/RigJoint"
import Model from "../../display/Model"

const getDirection = (fromPoint: Point3dType, toPoint: Point3dType) =>
    vector3
        .copy(toPoint as any)
        .sub(fromPoint as any)
        .normalize()

const setupJoint = (childJoint: RigJoint, parentJoint: RigJoint) => {
    parentJoint.setRotationFromDirection(getDirection(childJoint, parentJoint))
    parentJoint.attach(childJoint)
}

export const configCharacterRigSystem = createLoadedEffectSystem(
    "configCharacterRigSystem",
    {
        effect: (self: CharacterRig) => {
            if (self.leftHand && self.leftForeArm && self.leftArm) {
                const leftHandJoint = new RigJoint(self, "leftHand")
                const leftForeArmJoint = new RigJoint(self, "leftForeArm")
                const leftArmJoint = new RigJoint(self, "leftArm")

                setupJoint(leftHandJoint, leftForeArmJoint)
                setupJoint(leftForeArmJoint, leftArmJoint)

                leftHandJoint.finalize()
                leftForeArmJoint.finalize()
                leftArmJoint.finalize()

                leftForeArmJoint.quaternion.set(0, 0, 0, 1)
                leftArmJoint.quaternion.set(0, 0, 0, 1)
                leftArmJoint.innerRotationZ = 90
            }
        },
        cleanup: (self) => {
            for (const child of self.children ?? [])
                child instanceof RigJoint && child.dispose()
            const model = uuidMap.get(self.target!) as Model
            model.src = model.src
        },
        loading: (self) => {
            if (!self.target) return true
            const model = uuidMap.get(self.target)
            if (!model) return true
            return "$loadedObject3d" in model && !model.$loadedObject3d
        }
    }
)
