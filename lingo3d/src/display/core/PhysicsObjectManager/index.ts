import cubeShape from "./cannon/shapes/cubeShape"
import { Object3D, Vector3 } from "three"
import type { Body } from "cannon-es"
import { Cancellable } from "@lincode/promiselikes"
import { assertExhaustive } from "@lincode/utils"
import { Point3d } from "@lincode/math"
import SimpleObjectManager from "../SimpleObjectManager"
import IPhysicsObjectManager, {
    PhysicsGroupIndex,
    PhysicsOptions,
    PhysicsShape
} from "../../../interface/IPhysicsObjectManager"
import StaticObjectManager from "../StaticObjectManager"
import bvhContactMap from "./bvh/bvhContactMap"
import { cannonContactBodies, cannonContactMap } from "./cannon/cannonLoop"
import MeshItem from "../MeshItem"

export default class PhysicsObjectManager<T extends Object3D = Object3D>
    extends SimpleObjectManager<T>
    implements IPhysicsObjectManager
{
    protected _mAV?: Point3d
    private getMAV() {
        return (this._mAV ??= new Point3d(Infinity, Infinity, Infinity))
    }
    public get maxAngularVelocityX() {
        return this._mAV?.x ?? Infinity
    }
    public set maxAngularVelocityX(val) {
        this.getMAV().x = val
    }
    public get maxAngularVelocityY() {
        return this._mAV?.y ?? Infinity
    }
    public set maxAngularVelocityY(val) {
        this.getMAV().y = val
    }
    public get maxAngularVelocityZ() {
        return this._mAV?.z ?? Infinity
    }
    public set maxAngularVelocityZ(val) {
        this.getMAV().z = val
    }

    protected _mV?: Point3d
    private getMV() {
        return (this._mV ??= new Point3d(Infinity, Infinity, Infinity))
    }
    public get maxVelocityX() {
        return this._mV?.x ?? Infinity
    }
    public set maxVelocityX(val) {
        this.getMV().x = val
    }
    public get maxVelocityY() {
        return this._mV?.y ?? Infinity
    }
    public set maxVelocityY(val) {
        this.getMV().y = val
    }
    public get maxVelocityZ() {
        return this._mV?.z ?? Infinity
    }
    public set maxVelocityZ(val) {
        this.getMV().z = val
    }

    protected physicsUpdate?: {
        position?: { x?: boolean; y?: boolean; z?: boolean }
        rotation?: { x?: boolean; y?: boolean; z?: boolean }
    }
    protected physicsRotate() {
        if (!this.physicsUpdate) return
        const rotation = (this.physicsUpdate.rotation ??= {})
        rotation.x = true
        rotation.y = true
        rotation.z = true
    }
    protected physicsMove() {
        if (!this.physicsUpdate) return
        const position = (this.physicsUpdate.position ??= {})
        position.x = true
        position.y = true
        position.z = true
    }
    protected physicsMoveXZ() {
        if (!this.physicsUpdate) return
        const position = (this.physicsUpdate.position ??= {})
        position.x = true
        position.z = true
    }

    protected cannonBody?: Body

    public applyForce(x: number, y: number, z: number) {
        setTimeout(() => this.cannonBody?.applyForce({ x, y, z } as any))
    }

    public applyImpulse(x: number, y: number, z: number) {
        setTimeout(() => this.cannonBody?.applyImpulse({ x, y, z } as any))
    }

    public applyLocalForce(x: number, y: number, z: number) {
        setTimeout(() => this.cannonBody?.applyLocalForce({ x, y, z } as any))
    }

    public applyLocalImpulse(x: number, y: number, z: number) {
        setTimeout(() => this.cannonBody?.applyLocalImpulse({ x, y, z } as any))
    }

    public applyTorque(x: number, y: number, z: number) {
        setTimeout(() => this.cannonBody?.applyTorque({ x, y, z } as any))
    }

    public get velocity(): Point3d {
        if (this.bvhVelocity) return this.bvhVelocity

        if (this.cannonBody) return this.cannonBody.velocity

        return new Point3d(0, 0, 0)
    }
    public set velocity(val) {
        if (this.bvhVelocity) Object.assign(this.bvhVelocity, val)
        else if (this.cannonBody) Object.assign(this.cannonBody.velocity, val)
    }

    private refreshCannon() {
        this.physicsUpdate && (this.physics = this._physics ?? false)
    }

    protected _noTumble?: boolean
    public get noTumble() {
        return this._noTumble
    }
    public set noTumble(val) {
        this._noTumble = val
        this.refreshCannon()
    }

    protected _slippery?: boolean
    public get slippery() {
        return this._slippery
    }
    public set slippery(val) {
        this._slippery = val
        this.refreshCannon()
    }

    protected _mass?: number
    public get mass() {
        return this._mass
    }
    public set mass(val) {
        this._mass = val
        this.refreshCannon()
    }

    protected _physicsGroup?: PhysicsGroupIndex
    public get physicsGroup() {
        return this._physicsGroup
    }
    public set physicsGroup(val) {
        this._physicsGroup = val
        this.refreshCannon()
    }

    protected _ignorePhysicsGroups?: Array<PhysicsGroupIndex>
    public get ignorePhysicsGroups() {
        return this._ignorePhysicsGroups
    }
    public set ignorePhysicsGroups(val) {
        this._ignorePhysicsGroups = val
        this.refreshCannon()
    }

    protected _physicsShape?: PhysicsShape
    public get physicsShape() {
        return (this._physicsShape ??= cubeShape)
    }
    public set physicsShape(val) {
        this._physicsShape = val
        this.refreshCannon()
    }

    protected bvhVelocity?: Vector3
    protected bvhOnGround?: boolean
    protected bvhRadius?: number
    protected bvhHalfHeight?: number
    protected bvhMap?: boolean
    protected bvhCharacter?: boolean
    protected bvhDir?: Vector3

    protected initPhysics(val: PhysicsOptions, handle: Cancellable) {
        if (!val || handle.done) return

        switch (val) {
            case true:
            case "2d":
                import("./enableCannon").then((module) =>
                    module.default.call(this, handle)
                )
                break

            case "map":
                this.bvhMap = true
                import("./enableBVHMap").then((module) =>
                    module.default.call(this, handle, false)
                )
                break

            case "map-debug":
                this.bvhMap = true
                import("./enableBVHMap").then((module) =>
                    module.default.call(this, handle, true)
                )
                break

            case "character":
                this.bvhCharacter = true
                import("./enableBVHCharacter").then((module) =>
                    module.default.call(this, handle)
                )
                break

            default:
                assertExhaustive(val)
        }
    }
    protected _physics?: PhysicsOptions
    public get physics() {
        return this._physics ?? false
    }
    public set physics(val) {
        if (this._physics === val) return
        this._physics = val

        this.initPhysics(
            val,
            this.cancelHandle("physics", () => new Cancellable())!
        )
    }

    protected _gravity?: boolean
    public get gravity() {
        return this._gravity ?? true
    }
    public set gravity(val) {
        this._gravity = val
    }

    public override intersects(target: StaticObjectManager): boolean {
        if (this.done) return false
        if (target.done) return false
        if (this === target) return false

        if (target instanceof PhysicsObjectManager) {
            if (
                (this.bvhMap && target.bvhCharacter) ||
                (this.bvhCharacter && target.bvhMap)
            )
                return (
                    bvhContactMap.get(this)?.has(target) ||
                    bvhContactMap.get(target)?.has(this) ||
                    false
                )

            if (this.cannonBody && target.cannonBody) {
                cannonContactBodies.add(this.cannonBody)
                cannonContactBodies.add(target.cannonBody)
                return (
                    cannonContactMap
                        .get(this.cannonBody)
                        ?.has(target.cannonBody) ||
                    cannonContactMap
                        .get(target.cannonBody)
                        ?.has(this.cannonBody) ||
                    false
                )
            }
        }
        return super.intersects(target)
    }

    public override get x() {
        return super.x
    }
    public override set x(val) {
        super.x = val
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).x = true)
    }

    public override get y() {
        return super.y
    }
    public override set y(val) {
        super.y = val
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).y = true)
    }

    public override get z() {
        return super.z
    }
    public override set z(val) {
        super.z = val
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).z = true)
    }

    public override get rotationX() {
        return super.rotationX
    }
    public override set rotationX(val) {
        super.rotationX = val
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).x = true)
    }

    public override get rotationY() {
        return super.rotationY
    }
    public override set rotationY(val) {
        super.rotationY = val
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).y = true)
    }

    public override get rotationZ() {
        return super.rotationZ
    }
    public override set rotationZ(val) {
        super.rotationZ = val
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).z = true)
    }

    public override lookAt(target: MeshItem | Point3d): void
    public override lookAt(x: number, y: number | undefined, z: number): void
    public override lookAt(a0: any, a1?: any, a2?: any) {
        super.lookAt(a0, a1, a2)
        this.physicsRotate()
    }

    public override translateX(val: number) {
        super.translateX(val)
        this.physicsMove()
    }

    public override translateY(val: number) {
        super.translateY(val)
        this.physicsMove()
    }

    public override translateZ(val: number) {
        super.translateZ(val)
        this.physicsMove()
    }

    public override placeAt(object: MeshItem | Point3d) {
        super.placeAt(object)
        this.physicsMove()
        this.physicsRotate()
    }

    public override moveForward(distance: number) {
        if (distance === 0) return
        super.moveForward(distance)
        this.physicsMoveXZ()
    }

    public override moveRight(distance: number) {
        if (distance === 0) return
        super.moveRight(distance)
        this.physicsMoveXZ()
    }

    public override lerpTo(x: number, y: number, z: number, alpha: number) {
        super.lerpTo(x, y, z, alpha, () => this.physicsMove())
    }

    public override moveTo(
        x: number,
        y: number | undefined,
        z: number,
        speed: number
    ) {
        super.moveTo(x, y, z, speed, (y) =>
            y === undefined ? this.physicsMoveXZ() : this.physicsMove()
        )
    }
}
