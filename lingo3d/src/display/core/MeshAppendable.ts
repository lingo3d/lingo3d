import { Object3D, PropertyBinding, Quaternion, Vector3 } from "three"
import getWorldDirection from "../../memo/getWorldDirection"
import getWorldPosition from "../../memo/getWorldPosition"
import { quaternion, ray, vector3 } from "../utils/reusables"
import { point2Vec, vec2Point } from "../utils/vec2Point"
import { CM2M, M2CM } from "../../globals"
import IMeshAppendable from "../../interface/IMeshAppendable"
import { setManager } from "./utils/getManager"
import Appendable from "./Appendable"
import SpawnPoint from "../SpawnPoint"
import worldToCanvas from "../../memo/worldToCanvas"
import Nullable from "../../interface/utils/Nullable"
import { physxPtr } from "../../pointers/physxPtr"
import { assignPxTransform } from "../../engine/physx/pxMath"
import { actorPtrManagerMap } from "../../collections/pxCollections"
import PhysicsObjectManager from "./PhysicsObjectManager"
import scene from "../../engine/scene"
import Point3d from "../../math/Point3d"
import { Point3dType } from "../../typeGuards/isPoint"
import { onMoveSystem } from "../../systems/onMoveSystem"
import { lerpToSystem } from "../../systems/lerpToSystem"
import { lookToSystem } from "../../systems/lookToSystem"
import { moveToSystem } from "../../systems/moveToSystem"
import { configMeshAppendableSystem } from "../../systems/configSystems/configMeshAppendableSystem"
import getActualScale from "../../memo/getActualScale"
import getWorldQuaternion from "../../memo/getWorldQuaternion"
import frameSync from "../../api/frameSync"
import getParent from "./utils/getParent"
import { DEG2RAD, RAD2DEG } from "three/src/math/MathUtils"
import quadrant from "../../math/quadrant"
import { userIdMap } from "../../collections/idCollections"
import fastAttach from "../utils/fastAttach"

const up = new Vector3(0, 1, 0)

export default class MeshAppendable<T extends Object3D = Object3D>
    extends Appendable
    implements IMeshAppendable
{
    public $innerObject: T
    public position: Vector3
    public quaternion: Quaternion
    public userData: Record<string, any>

    public constructor(public $object: T = new Object3D() as T) {
        super()
        setManager($object, this)
        configMeshAppendableSystem.add(this)
        this.$innerObject = $object
        this.position = $object.position
        this.quaternion = $object.quaternion
        this.userData = $object.userData
    }

    public declare parent?: MeshAppendable
    public declare children?: Set<Appendable | MeshAppendable>

    public declare traverse: (
        cb: (appendable: Appendable | MeshAppendable) => void
    ) => void

    public declare traverseSome: (
        cb: (appendable: Appendable | MeshAppendable) => unknown
    ) => boolean

    public override append(child: Appendable | MeshAppendable) {
        this.$appendNode(child)
        "$object" in child && this.$innerObject.add(child.$object)
    }

    public override attach(child: Appendable | MeshAppendable) {
        this.$appendNode(child)
        "$object" in child && this.$innerObject.attach(child.$object)
    }

    protected override disposeNode() {
        super.disposeNode()
        this.$object.parent?.remove(this.$object)
        this.querySphere && physxPtr[0].destroy(this.querySphere)
    }

    public override get name() {
        return super.name
    }
    public override set name(val) {
        super.name = this.$object.name = PropertyBinding.sanitizeNodeName(
            val ?? ""
        )
    }

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

    public getWorldPosition() {
        return vec2Point(getWorldPosition(this.$innerObject))
    }

    public getWorldDirection() {
        return getWorldDirection(this.$innerObject)
    }

    public getProjectedPosition() {
        return worldToCanvas(this.$innerObject)
    }

    private _onMove?: () => void
    public get onMove() {
        return this._onMove
    }
    public set onMove(cb) {
        this._onMove = cb
        cb ? onMoveSystem.add(this) : onMoveSystem.delete(this)
    }

    public translateX(val: number) {
        this.$object.translateX(frameSync(val * CM2M))
    }

    public translateY(val: number) {
        this.$object.translateY(frameSync(val * CM2M))
    }

    public translateZ(val: number) {
        this.$object.translateZ(frameSync(val * CM2M))
    }

    public rotateX(val: number) {
        this.$object.rotateX(frameSync(val * DEG2RAD))
    }

    public rotateY(val: number) {
        this.$object.rotateY(frameSync(val * DEG2RAD))
    }

    public rotateZ(val: number) {
        this.$object.rotateZ(frameSync(val * DEG2RAD))
    }

    public setRotationFromDirection(direction: Point3dType) {
        const ogParent = getParent(this.$object)
        ogParent !== scene && fastAttach(scene, this.$object)

        this.$object.setRotationFromQuaternion(
            quaternion.setFromUnitVectors(up, direction as Vector3)
        )
        ogParent !== scene && fastAttach(ogParent, this.$object)
    }

    public placeAt(
        target: MeshAppendable | Point3dType | SpawnPoint | string,
        rotate?: boolean
    ) {
        if (typeof target === "string") {
            const [found] = userIdMap.get(target) ?? []
            if (!found || !("$object" in found)) return
            target = found
        }
        if ("$object" in target) {
            if ("isSpawnPoint" in target)
                target.$innerObject.position.y = getActualScale(this).y * 0.5
            this.position.copy(getWorldPosition(target.$innerObject))
            rotate &&
                "quaternion" in this &&
                this.quaternion.copy(getWorldQuaternion(target.$object))
        } else this.position.copy(point2Vec(target))
    }

    public moveForward(distance: number) {
        vector3.setFromMatrixColumn(this.$object.matrix, 0)
        vector3.crossVectors(this.$object.up, vector3)
        this.position.addScaledVector(vector3, frameSync(distance * CM2M))
    }

    public moveRight(distance: number) {
        vector3.setFromMatrixColumn(this.$object.matrix, 0)
        this.position.addScaledVector(vector3, frameSync(distance * CM2M))
    }

    public onMoveToEnd: Nullable<() => void>

    public lerpTo(x: number, y: number, z: number, alpha = 0.05) {
        const from = new Vector3(this.x, this.y, this.z)
        const to = new Vector3(x, y, z)

        moveToSystem.delete(this)
        lerpToSystem.add(this, { from, to, alpha })
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

        lerpToSystem.delete(this)
        moveToSystem.add(this, { sx, sy, sz, x, y, z, quad })
    }

    protected getRay() {
        return ray.set(
            getWorldPosition(this.$innerObject),
            getWorldDirection(this.$innerObject)
        )
    }

    public pointAt(distance: number) {
        return vec2Point(this.getRay().at(distance * CM2M, vector3))
    }

    public get rotationX() {
        return this.$object.rotation.x * RAD2DEG
    }
    public set rotationX(val) {
        this.$object.rotation.x = val * DEG2RAD
    }

    public get rotationY() {
        return this.$object.rotation.y * RAD2DEG
    }
    public set rotationY(val) {
        this.$object.rotation.y = val * DEG2RAD
    }

    public get rotationZ() {
        return this.$object.rotation.z * RAD2DEG
    }
    public set rotationZ(val) {
        this.$object.rotation.z = val * DEG2RAD
    }

    public lookAt(target: MeshAppendable | Point3dType): void
    public lookAt(x: number, y: number | undefined, z: number): void
    public lookAt(
        a0: MeshAppendable | Point3dType | number,
        a1?: number,
        a2?: number
    ) {
        if (typeof a0 === "number") {
            this.lookAt(new Point3d(a0, a1 === undefined ? this.y : a1, a2!))
            return
        }
        if ("$object" in a0)
            this.$object.lookAt(getWorldPosition(a0.$innerObject))
        else this.$object.lookAt(point2Vec(a0))
    }

    public onLookToEnd: (() => void) | undefined

    public lookTo(target: MeshAppendable | Point3dType, alpha?: number): void
    public lookTo(
        x: number,
        y: number | undefined,
        z: number,
        alpha?: number
    ): void
    public lookTo(
        a0: MeshAppendable | Point3dType | number,
        a1: number | undefined,
        a2?: number,
        a3?: number
    ) {
        if (typeof a0 === "number") {
            this.lookTo(
                new Point3d(a0, a1 === undefined ? this.y : a1, a2!),
                a3
            )
            return
        }
        const { quaternion } = this.$object
        const quaternionOld = quaternion.clone()
        this.lookAt(a0)
        const quaternionNew = quaternion.clone()

        quaternion.copy(quaternionOld)

        lookToSystem.add(this, { quaternion, quaternionNew, a1 })
    }

    private queryRadius?: number
    private querySphere?: any
    public queryPhysicsNearby(radius: number) {
        const { PxSphereGeometry, pxOverlap, destroy } = physxPtr[0]
        if (!PxSphereGeometry) return []

        if (radius !== this.queryRadius) {
            this.queryRadius = radius
            this.querySphere && destroy(this.querySphere)
            this.querySphere = new PxSphereGeometry(radius * CM2M)
        }
        const result: Array<PhysicsObjectManager> = []
        for (const item of pxOverlap(this.querySphere, assignPxTransform(this)))
            result.push(actorPtrManagerMap.get(item.actor.ptr)!)
        return result
    }
}
