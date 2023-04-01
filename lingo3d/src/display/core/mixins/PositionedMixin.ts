import { Point3d, quadrant } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { Object3D, Vector3 } from "three"
import { getAppendablesById } from "../../../api/core/Appendable"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { fpsRatioPtr } from "../../../engine/eventLoop"
import {
    TransformControlsMode,
    TransformControlsPhase
} from "../../../events/onTransformControls"
import { M2CM, CM2M } from "../../../globals"
import IPositioned from "../../../interface/IPositioned"
import Nullable from "../../../interface/utils/Nullable"
import {
    addLerpToSystem,
    deleteLerpToSystem
} from "../../../systems/lerpToSystem"
import {
    addMoveToSystem,
    deleteMoveToSystem
} from "../../../systems/moveToSystem"
import {
    addOnMoveSystem,
    deleteOnMoveSystem
} from "../../../systems/onMoveSystem"
import SpawnPoint from "../../SpawnPoint"
import getActualScale from "../../utils/getActualScale"
import getCenter from "../../utils/getCenter"
import getWorldPosition from "../../utils/getWorldPosition"
import getWorldQuaternion from "../../utils/getWorldQuaternion"
import { vector3 } from "../../utils/reusables"
import { point2Vec, vec2Point } from "../../utils/vec2Point"
import worldToCanvas from "../../utils/worldToCanvas"
import { addTransformChangedSystem } from "../../../systems/configSystems/transformChangedSystem"

export default abstract class PositionedMixin<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IPositioned
{
    public get x() {
        return this.position.x * M2CM
    }
    public set x(val) {
        this.position.x = val * CM2M
        addTransformChangedSystem(this)
    }

    public get y() {
        return this.position.y * M2CM
    }
    public set y(val) {
        this.position.y = val * CM2M
        addTransformChangedSystem(this)
    }

    public get z() {
        return this.position.z * M2CM
    }
    public set z(val) {
        this.position.z = val * CM2M
        addTransformChangedSystem(this)
    }

    public get worldPosition() {
        return vec2Point(getWorldPosition(this.object3d))
    }

    public get canvasX() {
        return worldToCanvas(this.object3d).x
    }

    public get canvasY() {
        return worldToCanvas(this.object3d).y
    }

    private _onMove?: () => void
    public get onMove() {
        return this._onMove
    }
    public set onMove(cb) {
        this._onMove = cb
        this.cancelHandle(
            "onMove",
            cb &&
                (() => {
                    addOnMoveSystem(this.outerObject3d, { cb })
                    return new Cancellable(() =>
                        deleteOnMoveSystem(this.outerObject3d)
                    )
                })
        )
    }

    public get onTransformControls() {
        return this.userData.onTransformControls
    }
    public set onTransformControls(
        cb:
            | ((
                  phase: TransformControlsPhase,
                  mode: TransformControlsMode
              ) => void)
            | undefined
    ) {
        this.userData.onTransformControls = cb
    }

    public translateX(val: number) {
        this.outerObject3d.translateX(val * CM2M * fpsRatioPtr[0])
        addTransformChangedSystem(this)
    }

    public translateY(val: number) {
        this.outerObject3d.translateY(val * CM2M * fpsRatioPtr[0])
        addTransformChangedSystem(this)
    }

    public translateZ(val: number) {
        this.outerObject3d.translateZ(val * CM2M * fpsRatioPtr[0])
        addTransformChangedSystem(this)
    }

    public placeAt(target: MeshAppendable | Point3d | SpawnPoint | string) {
        if (typeof target === "string") {
            const [found] = getAppendablesById(target)
            if (!(found instanceof MeshAppendable)) return
            target = found
        }
        if ("outerObject3d" in target) {
            if ("isSpawnPoint" in target)
                target.object3d.position.y = getActualScale(this).y * 0.5
            this.position.copy(getCenter(target.object3d))
            "quaternion" in this &&
                this.quaternion.copy(getWorldQuaternion(target.outerObject3d))
        } else this.position.copy(point2Vec(target))
        addTransformChangedSystem(this)
    }

    public moveForward(distance: number) {
        vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
        vector3.crossVectors(this.outerObject3d.up, vector3)
        this.position.addScaledVector(vector3, distance * CM2M * fpsRatioPtr[0])
        addTransformChangedSystem(this)
    }

    public moveRight(distance: number) {
        vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
        this.position.addScaledVector(vector3, distance * CM2M * fpsRatioPtr[0])
        addTransformChangedSystem(this)
    }

    public onMoveToEnd: Nullable<() => void>

    public lerpTo(x: number, y: number, z: number, alpha = 0.05) {
        const from = new Vector3(this.x, this.y, this.z)
        const to = new Vector3(x, y, z)

        this.cancelHandle("lerpTo", () => {
            addLerpToSystem(this, { from, to, alpha })
            return new Cancellable(() => deleteLerpToSystem(this))
        })
    }

    public moveTo(x: number, y: number | undefined, z: number, speed = 5) {
        if (x === this.x) x += 0.01
        if (z === this.z) z += 0.01

        const {
            x: rx,
            y: ry,
            z: rz
        } = new Vector3(
            x - this.x,
            y === undefined ? 0 : y - this.y,
            z - this.z
        ).normalize()
        const sx = speed * rx
        const sy = speed * ry
        const sz = speed * rz

        const quad = quadrant(x, z, this.x, this.z)

        this.cancelHandle("lerpTo", () => {
            addMoveToSystem(this, { sx, sy, sz, x, y, z, quad })
            return new Cancellable(() => deleteMoveToSystem(this))
        })
    }
}
