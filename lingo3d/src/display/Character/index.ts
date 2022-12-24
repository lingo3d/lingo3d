import { Matrix4, Object3D, Quaternion, Vector3 } from "three"
import { onBeforeRender } from "../../events/onBeforeRender"
import { YBOT_URL } from "../../globals"
import IModel, { modelDefaults, modelSchema } from "../../interface/IModel"
import Bone from "../Bone"
import Model from "../Model"
import getWorldPosition from "../utils/getWorldPosition"
import localToLocal from "../utils/localToLocal"
import { subQuaternions } from "../utils/quaternions"

const ComputeWorldMatrixRecursive = (
    entity: Object3D,
    localMatrix: Matrix4
) => {
    let parentID = entity.parent
    while (parentID) {
        localMatrix.multiply(parentID.matrix)
        parentID = parentID.parent
    }
    return localMatrix
}

const ComputeInverseParentMatrixRecursive = (entity: Object3D) => {
    const inverseParentMatrix = new Matrix4()
    let parentID = entity.parent
    if (parentID) {
        while (parentID) {
            inverseParentMatrix.multiply(parentID.matrix)
            parentID = parentID.parent
        }
        inverseParentMatrix.invert()
    }
    return inverseParentMatrix
}

export default class Character extends Model implements IModel {
    public static override componentName = "character"
    public static override defaults = modelDefaults
    public static override schema = modelSchema

    public constructor() {
        super()
        this.width = 20
        this.depth = 20
        this.scale = 1.7

        this.src = YBOT_URL

        this.loaded.then((loaded) => {
            let arm: Object3D | undefined
            let foreArm: Object3D | undefined
            let hand: Object3D | undefined
            loaded.traverse((child) => {
                if (child.name === "mixamorigLeftArm" && !arm) arm = child
                if (child.name === "mixamorigLeftForeArm" && !foreArm)
                    foreArm = child
                if (child.name === "mixamorigLeftHand" && !hand) hand = child
            })
            if (!arm || !foreArm || !hand) return

            const bone = new Bone(arm, foreArm)

            const bone_source = bone.outerObject3d
            const bone_dest = arm

            const bindMatrix = ComputeWorldMatrixRecursive(
                bone_source,
                bone_source.matrix.clone()
            )
            const inverseBindMatrix = bindMatrix.clone().invert()
            const targetMatrix = ComputeWorldMatrixRecursive(
                bone_dest,
                bone_dest.matrix.clone()
            )
            const inverseParentMatrix =
                ComputeInverseParentMatrixRecursive(bone_dest)
        })
    }
}
