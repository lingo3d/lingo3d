import {
    Point,
    Point3d,
    quadrant,
    rotatePoint,
    vertexAngle
} from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { Object3D, Quaternion, Vector3 } from "three"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { fpsRatioPtr } from "../../../engine/eventLoop"
import {
    TransformControlsMode,
    TransformControlsPhase
} from "../../../events/onTransformControls"
import { M2CM, CM2M } from "../../../globals"
import IPositioned from "../../../interface/IPositioned"
import Nullable from "../../../interface/utils/Nullable"
import renderSystemWithData from "../../../utils/renderSystemWithData"
import SpawnPoint from "../../SpawnPoint"
import fpsAlpha from "../../utils/fpsAlpha"
import getActualScale from "../../utils/getActualScale"
import getCenter from "../../utils/getCenter"
import getWorldPosition from "../../utils/getWorldPosition"
import getWorldQuaternion from "../../utils/getWorldQuaternion"
import { vector3 } from "../../utils/reusables"
import { positionChanged } from "../../utils/trackObject"
import { point2Vec, vec2Point } from "../../utils/vec2Point"
import worldToCanvas from "../../utils/worldToCanvas"
import { getMeshAppendablesById } from "../StaticObjectManager"

const [addTrackingSystem, deleteTrackingSystem] = renderSystemWithData(
    (item: Object3D, data: { cb: () => void }) => {
        positionChanged(item) && data.cb()
    }
)

const [addLerpSystem, deleteLerpSystem] = renderSystemWithData(
    (
        self: PositionedMixin,
        data: {
            from: Vector3
            to: Vector3
            alpha: number
            onFrame?: () => void
        }
    ) => {
        const { x, y, z } = data.from.lerp(data.to, fpsAlpha(data.alpha))

        if (
            Math.abs(self.x - x) < 0.1 &&
            Math.abs(self.y - y) < 0.1 &&
            Math.abs(self.z - z) < 0.1
        ) {
            //@ts-ignore
            self.cancelHandle("lerpTo", undefined)
            self.onMoveToEnd?.()
        }
        self.x = x
        self.y = y
        self.z = z

        data.onFrame?.()
    }
)

const [addMoveSystem, deleteMoveSystem] = renderSystemWithData(
    (
        self: PositionedMixin,
        data: {
            sx: number
            sy: number
            sz: number
            x: number
            y: number | undefined
            z: number
            quad: number
            onFrame?: () => void
        }
    ) => {
        self.x += data.sx * fpsRatioPtr[0]
        if (data.y !== undefined) self.y += data.sy * fpsRatioPtr[0]
        self.z += data.sz * fpsRatioPtr[0]

        const angle = vertexAngle(
            new Point(self.x, self.z),
            new Point(data.x, data.z),
            new Point(self.x, data.z)
        )
        const rotated = rotatePoint(
            new Point(data.x, data.z),
            new Point(self.x, self.z),
            data.quad === 1 || data.quad === 4 ? angle : -angle
        )

        if (data.z > rotated.y) {
            //@ts-ignore
            self.cancelHandle("lerpTo", undefined)
            self.onMoveToEnd?.()
        }
        data.onFrame?.()
    }
)

export default abstract class PositionedMixin<T extends Object3D = Object3D>
    implements IPositioned
{
    public declare outerObject3d: T
    public declare object3d: T
    public declare position: Vector3

    public get x() {
        return this.position.x * M2CM
    }
    public set x(val) {
        this.position.x = val * CM2M
    }

    public get y() {
        return this.position.y * M2CM
    }
    public set y(val) {
        this.position.y = val * CM2M
    }

    public get z() {
        return this.position.z * M2CM
    }
    public set z(val) {
        this.position.z = val * CM2M
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
        //@ts-ignore
        this.cancelHandle(
            "onMove",
            cb &&
                (() => {
                    addTrackingSystem(this.outerObject3d, { cb })
                    return new Cancellable(() =>
                        deleteTrackingSystem(this.outerObject3d)
                    )
                })
        )
    }

    public get onTransformControls() {
        return this.outerObject3d.userData.onTransformControls
    }
    public set onTransformControls(
        cb:
            | ((
                  phase: TransformControlsPhase,
                  mode: TransformControlsMode
              ) => void)
            | undefined
    ) {
        this.outerObject3d.userData.onTransformControls = cb
    }

    public translateX(val: number) {
        this.outerObject3d.translateX(val * CM2M * fpsRatioPtr[0])
    }

    public translateY(val: number) {
        this.outerObject3d.translateY(val * CM2M * fpsRatioPtr[0])
    }

    public translateZ(val: number) {
        this.outerObject3d.translateZ(val * CM2M * fpsRatioPtr[0])
    }

    public placeAt(target: MeshAppendable | Point3d | SpawnPoint | string) {
        if (typeof target === "string") {
            const [found] = getMeshAppendablesById(target)
            if (!found) return
            target = found
        }
        if ("outerObject3d" in target) {
            if ("isSpawnPoint" in target)
                target.object3d.position.y = getActualScale(this).y * 0.5
            this.position.copy(getCenter(target.object3d))
            "quaternion" in this &&
                (this.quaternion as Quaternion).copy(
                    getWorldQuaternion(target.outerObject3d)
                )
            return
        }
        this.position.copy(point2Vec(target))
    }

    public moveForward(distance: number) {
        vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
        vector3.crossVectors(this.outerObject3d.up, vector3)
        this.position.addScaledVector(vector3, distance * CM2M * fpsRatioPtr[0])
    }

    public moveRight(distance: number) {
        vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
        this.position.addScaledVector(vector3, distance * CM2M * fpsRatioPtr[0])
    }

    public onMoveToEnd: Nullable<() => void>

    public lerpTo(
        x: number,
        y: number,
        z: number,
        alpha = 0.05,
        onFrame?: () => void
    ) {
        const from = new Vector3(this.x, this.y, this.z)
        const to = new Vector3(x, y, z)

        //@ts-ignore
        this.cancelHandle("lerpTo", () => {
            addLerpSystem(this, { from, to, alpha, onFrame })
            return new Cancellable(() => deleteLerpSystem(this))
        })
    }

    public moveTo(
        x: number,
        y: number | undefined,
        z: number,
        speed = 5,
        onFrame?: () => void
    ) {
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

        //@ts-ignore
        this.cancelHandle("lerpTo", () => {
            addMoveSystem(this, { sx, sy, sz, x, y, z, quad, onFrame })
            return new Cancellable(() => deleteMoveSystem(this))
        })
    }
}
