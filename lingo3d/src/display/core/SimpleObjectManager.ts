import {
    Point3d,
    vertexAngle,
    Point,
    rotatePoint,
    quadrant
} from "@lincode/math"
import { Object3D, Vector3 } from "three"
import { vector3 } from "../utils/reusables"
import { point2Vec } from "../utils/vec2Point"
import ISimpleObjectManager from "../../interface/ISimpleObjectManager"
import getCenter from "../utils/getCenter"
import { applyMixins } from "@lincode/utils"
import getWorldQuaternion from "../utils/getWorldQuaternion"
import AnimatedObjectManager from "./AnimatedObjectManager"
import Nullable from "../../interface/utils/Nullable"
import SpawnPoint from "../SpawnPoint"
import getActualScale from "../utils/getActualScale"
import { fpsRatioPtr } from "../../engine/eventLoop"
import fpsAlpha from "../utils/fpsAlpha"
import { CM2M } from "../../globals"
import PositionedMixin from "./mixins/PositionedMixin"
import DirectionedMixin from "./mixins/DirectionedMixin"
import MeshAppendable from "../../api/core/MeshAppendable"
import { getMeshAppendablesById } from "./StaticObjectManager"
import renderSystemWithData from "../../utils/renderSystemWithData"
import { Cancellable } from "@lincode/promiselikes"

const [addLerpSystem, deleteLerpSystem] = renderSystemWithData(
    (
        self: SimpleObjectManager,
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
        self: SimpleObjectManager,
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
            self.cancelHandle("lerpTo", undefined)
            self.onMoveToEnd?.()
        }
        data.onFrame?.()
    }
)

class SimpleObjectManager<T extends Object3D = Object3D>
    extends AnimatedObjectManager<T>
    implements ISimpleObjectManager
{
    public get scaleX() {
        return this.outerObject3d.scale.x
    }
    public set scaleX(val) {
        this.outerObject3d.scale.x = val
    }

    public get scaleY() {
        return this.outerObject3d.scale.y
    }
    public set scaleY(val) {
        this.outerObject3d.scale.y = val
    }

    public get scaleZ() {
        return this.outerObject3d.scale.z
    }
    public set scaleZ(val) {
        this.outerObject3d.scale.z = val
    }

    public get scale() {
        return this.scaleX
    }
    public set scale(val) {
        this.scaleX = val
        this.scaleY = val
        this.scaleZ = val
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
            this.quaternion.copy(getWorldQuaternion(target.outerObject3d))
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

        this.cancelHandle("lerpTo", () => {
            addMoveSystem(this, { sx, sy, sz, x, y, z, quad, onFrame })
            return new Cancellable(() => deleteMoveSystem(this))
        })
    }
}
interface SimpleObjectManager<T extends Object3D = Object3D>
    extends AnimatedObjectManager<T>,
        PositionedMixin<T>,
        DirectionedMixin<T> {}
applyMixins(SimpleObjectManager, [DirectionedMixin, PositionedMixin])
export default SimpleObjectManager
