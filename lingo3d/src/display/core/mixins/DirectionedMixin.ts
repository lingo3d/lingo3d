import { rad2Deg, deg2Rad, Point3d } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { Object3D, Quaternion } from "three"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { M2CM } from "../../../globals"
import IDirectioned from "../../../interface/IDirectioned"
import renderSystemWithData from "../../../utils/renderSystemWithData"
import fpsAlpha from "../../utils/fpsAlpha"
import getWorldDirection from "../../utils/getWorldDirection"
import getWorldPosition from "../../utils/getWorldPosition"
import { point2Vec } from "../../utils/vec2Point"
import PositionedMixin from "./PositionedMixin"

const [addLookSystem, deleteLookSystem] = renderSystemWithData(
    (
        self: DirectionedMixin,
        data: { quaternion: Quaternion; quaternionNew: Quaternion; a1?: number }
    ) => {
        const { quaternion, quaternionNew, a1 } = data
        quaternion.slerp(quaternionNew, fpsAlpha(a1 ?? 0.05))

        const x = Math.abs(quaternion.x - quaternionNew.x)
        const y = Math.abs(quaternion.y - quaternionNew.y)
        const z = Math.abs(quaternion.z - quaternionNew.z)
        const w = Math.abs(quaternion.w - quaternionNew.w)
        if (x + y + z + w < 0.001) {
            //@ts-ignore
            self.cancelHandle("lookTo", undefined)
            self.onLookToEnd?.()

            quaternion.copy(quaternionNew)
        }
    }
)

const getY = (manager: PositionedMixin | DirectionedMixin) =>
    "position" in manager ? manager.position.y : 0

export default abstract class DirectionedMixin<T extends Object3D = Object3D>
    implements IDirectioned
{
    public declare outerObject3d: T
    public declare object3d: T
    public declare quaternion: Quaternion

    public get rotationX() {
        return this.outerObject3d.rotation.x * rad2Deg
    }
    public set rotationX(val) {
        this.outerObject3d.rotation.x = val * deg2Rad
    }

    public get rotationY() {
        return this.outerObject3d.rotation.y * rad2Deg
    }
    public set rotationY(val) {
        this.outerObject3d.rotation.y = val * deg2Rad
    }

    public get rotationZ() {
        return this.outerObject3d.rotation.z * rad2Deg
    }
    public set rotationZ(val) {
        this.outerObject3d.rotation.z = val * deg2Rad
    }

    public get rotation() {
        return this.rotationZ
    }
    public set rotation(val) {
        this.rotationZ = val
    }

    public lookAt(target: MeshAppendable | Point3d): void
    public lookAt(x: number, y: number | undefined, z: number): void
    public lookAt(
        a0: MeshAppendable | Point3d | number,
        a1?: number,
        a2?: number
    ) {
        if (typeof a0 === "number") {
            this.lookAt(
                new Point3d(a0, a1 === undefined ? getY(this) * M2CM : a1, a2!)
            )
            return
        }
        if ("outerObject3d" in a0)
            this.outerObject3d.lookAt(getWorldPosition(a0.object3d))
        else this.outerObject3d.lookAt(point2Vec(a0))
    }

    public onLookToEnd: (() => void) | undefined

    public lookTo(target: MeshAppendable | Point3d, alpha?: number): void
    public lookTo(
        x: number,
        y: number | undefined,
        z: number,
        alpha?: number
    ): void
    public lookTo(
        a0: MeshAppendable | Point3d | number,
        a1: number | undefined,
        a2?: number,
        a3?: number
    ) {
        if (typeof a0 === "number") {
            this.lookTo(
                new Point3d(a0, a1 === undefined ? getY(this) * M2CM : a1, a2!),
                a3
            )
            return
        }
        const { quaternion } = this.outerObject3d
        const quaternionOld = quaternion.clone()
        this.lookAt(a0)
        const quaternionNew = quaternion.clone()

        quaternion.copy(quaternionOld)

        //@ts-ignore
        this.cancelHandle("lookTo", () => {
            addLookSystem(this, { quaternion, quaternionNew, a1 })
            return new Cancellable(() => deleteLookSystem(this))
        })
    }

    public get worldDirection() {
        return getWorldDirection(this.object3d)
    }
}
