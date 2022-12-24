import { Object3D, Quaternion } from "three"
import { onBeforeRender } from "../../events/onBeforeRender"
import { YBOT_URL } from "../../globals"
import IModel, { modelDefaults, modelSchema } from "../../interface/IModel"
import Bone from "../Bone"
import Model from "../Model"
import getWorldQuaternion from "../utils/getWorldQuaternion"
import { subQuaternions, worldToLocal } from "../utils/quaternions"

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

        this.loaded.then(() => {
            const arm = this.find("mixamorigLeftArm")?.outerObject3d
            const foreArm = this.find("mixamorigLeftForeArm")?.outerObject3d
            const hand = this.find("mixamorigLeftHand")?.outerObject3d

            if (!arm || !foreArm || !hand) return

            const data: Array<[Bone, Object3D, Quaternion]> = []
            const boneMap = new WeakMap<Object3D, Bone>()
            const attachBone = (arm: Object3D, foreArm: Object3D) => {
                const bone = new Bone(arm, foreArm)
                boneMap.set(foreArm, bone)
                boneMap.get(arm)?.attach(bone)
                const qDiff = subQuaternions(
                    getWorldQuaternion(bone.outerObject3d),
                    arm.quaternion
                )
                data.push([bone, arm, qDiff])
            }
            attachBone(arm, foreArm)
            attachBone(foreArm, hand)

            const handle = onBeforeRender(() => {
                for (const [bone, arm, qDiff] of data) {
                    arm.quaternion.copy(
                        worldToLocal(
                            arm,
                            getWorldQuaternion(bone.outerObject3d)
                        )
                    )
                    subQuaternions(arm.quaternion, qDiff)
                }
            })
            return () => {
                handle.cancel()
            }
        })
    }
}
