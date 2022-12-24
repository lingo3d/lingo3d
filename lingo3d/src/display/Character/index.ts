import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from "three"
import scene from "../../engine/scene"
import { YBOT_URL } from "../../globals"
import IModel, { modelDefaults, modelSchema } from "../../interface/IModel"
import Bone from "../Bone"
import Model from "../Model"
import Cube from "../primitives/Cube"
import getWorldPosition from "../utils/getWorldPosition"
import localToLocal from "../utils/localToLocal"
import { euler, quaternion, vector3 } from "../utils/reusables"
import { vec2Point } from "../utils/vec2Point"

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
            loaded.traverse((child) => {
                if (child.name === "mixamorigLeftArm" && !arm) arm = child
                if (child.name === "mixamorigLeftForeArm" && !foreArm)
                    foreArm = child
            })
            if (!arm || !foreArm) return

            const bone = new Bone(arm, foreArm)

            scene.attach(arm!)

            const qDiff = subQuaternions(
                bone.outerObject3d.quaternion.clone(),
                arm.quaternion
            )

            bone.onLoop = () => {
                arm!.quaternion.copy(bone.outerObject3d.quaternion)
                subQuaternions(arm!.quaternion, qDiff)
            }
        })
    }
}

//quaternion addition
const addQuaternions = (a: Quaternion, b: Quaternion) => {
    const qax = a.x,
        qay = a.y,
        qaz = a.z,
        qaw = a.w
    const qbx = b.x,
        qby = b.y,
        qbz = b.z,
        qbw = b.w

    a.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby
    a.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz
    a.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx
    a.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz

    return a
}

//quaternion subtraction
const subQuaternions = (a: Quaternion, b: Quaternion) => {
    const qax = a.x,
        qay = a.y,
        qaz = a.z,
        qaw = a.w
    const qbx = b.x,
        qby = b.y,
        qbz = b.z,
        qbw = b.w

    a.x = qax * qbw - qaw * qbx - qay * qbz + qaz * qby
    a.y = qay * qbw - qaw * qby - qaz * qbx + qax * qbz
    a.z = qaz * qbw - qaw * qbz - qax * qby + qay * qbx
    a.w = qaw * qbw + qax * qbx + qay * qby + qaz * qbz

    return a
}
