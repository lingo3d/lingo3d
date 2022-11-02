import { Mesh, Object3D, Vector3 } from "three"
import type { Body, Vec3 } from "cannon-es"
import { Point3d } from "@lincode/math"
import SimpleObjectManager from "../SimpleObjectManager"
import IPhysicsObjectManager, {
    PhysicsGroupIndex,
    PhysicsOptions
} from "../../../interface/IPhysicsObjectManager"
import StaticObjectManager from "../StaticObjectManager"
import bvhContactMap from "./bvh/bvhContactMap"
import MeshItem from "../MeshItem"
import characterCameraPlaced from "../CharacterCamera/characterCameraPlaced"
import PhysicsUpdate from "./PhysicsUpdate"
import { Reactive } from "@lincode/reactivity"
import {
    cannonContactBodies,
    cannonContactMap,
    cannonSet
} from "./cannon/cannonCollections"
import scene from "../../../engine/scene"
import { Cancellable } from "@lincode/promiselikes"
import cubeShape from "./cannon/shapes/cubeShape"
import pillShape from "./cannon/shapes/pillShape"

const physicsGroups = <const>[1, 2, 4, 8, 16, 32]
const physicsGroupIndexes = <const>[0, 1, 2, 3, 4, 5]

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

    protected positionUpdate?: PhysicsUpdate
    protected rotationUpdate?: PhysicsUpdate

    protected physicsShape?: typeof cubeShape

    private refreshPhysicsState?: Reactive<{}>
    protected refreshPhysics(loaded?: Object3D) {
        if (this.refreshPhysicsState) {
            this.refreshPhysicsState.set({})
            return
        }
        this.createEffect(() => {
            const { _physics } = this
            if (!_physics) return

            this.outerObject3d.parent !== scene &&
                scene.attach(this.outerObject3d)

            const handle = new Cancellable()
            ;(async () => {
                const { slipperyMaterial, defaultMaterial, world } =
                    await import("./cannon/cannonLoop")

                const { Body, Vec3 } = await import("cannon-es")
                if (handle.done) return

                const body = (this.cannonBody = new Body({
                    mass: _physics === "map" ? 0 : this._mass ?? 1,
                    material: this._slippery
                        ? slipperyMaterial
                        : defaultMaterial,
                    collisionFilterGroup:
                        physicsGroups[this._physicsGroup ?? 0],
                    collisionFilterMask: physicsGroupIndexes
                        .filter(
                            (index) =>
                                !this._ignorePhysicsGroups?.includes(index)
                        )
                        .map((index) => physicsGroups[index])
                        .reduce((acc, curr) => acc + curr, 0)
                }))
                body.position.copy(this.outerObject3d.position as any)
                body.quaternion.copy(this.outerObject3d.quaternion as any)

                if (loaded && _physics === "map") {
                    const { threeToCannon, ShapeType } = await import(
                        "three-to-cannon"
                    )
                    const shape = threeToCannon(loaded, {
                        type: ShapeType.MESH
                    })?.shape
                    if (!shape) return

                    body.addShape(shape)
                    world.addBody(body)
                    handle.then(() => world.removeBody(body))
                    return
                }

                const addShape =
                    _physics === "character"
                        ? pillShape
                        : this.physicsShape ?? cubeShape

                await addShape.call(this)
                if (this.done) return

                if (_physics === "2d") {
                    body.angularFactor = new Vec3(0, 0, 1)
                    body.linearFactor = new Vec3(1, 1, 0)
                }
                if (_physics === "character" || this._upright)
                    body.angularFactor = new Vec3(0, 0, 0)

                this.rotationUpdate = new PhysicsUpdate()
                this.positionUpdate = new PhysicsUpdate()
                world.addBody(body)
                cannonSet.add(this)

                handle.then(() => {
                    world.removeBody(body)
                    cannonSet.delete(this)
                    this.cannonBody = undefined
                    this.rotationUpdate = undefined
                    this.positionUpdate = undefined
                })
            })()

            return () => {
                handle.cancel()
            }
        }, [(this.refreshPhysicsState = new Reactive({})).get])
    }

    protected _upright?: boolean
    public get upright() {
        return this._upright
    }
    public set upright(val) {
        this._upright = val
        this.refreshPhysics()
    }

    protected _slippery?: boolean
    public get slippery() {
        return this._slippery
    }
    public set slippery(val) {
        this._slippery = val
        this.refreshPhysics()
    }

    protected _mass?: number
    public get mass() {
        return this._mass
    }
    public set mass(val) {
        this._mass = val
        this.refreshPhysics()
    }

    protected _physicsGroup?: PhysicsGroupIndex
    public get physicsGroup() {
        return this._physicsGroup
    }
    public set physicsGroup(val) {
        this._physicsGroup = val
        this.refreshPhysics()
    }

    protected _ignorePhysicsGroups?: Array<PhysicsGroupIndex>
    public get ignorePhysicsGroups() {
        return this._ignorePhysicsGroups
    }
    public set ignorePhysicsGroups(val) {
        this._ignorePhysicsGroups = val
        this.refreshPhysics()
    }

    protected bvhVelocity?: Vector3
    protected bvhOnGround?: boolean
    protected bvhRadius?: number
    protected bvhHalfHeight?: number
    protected bvhMap?: boolean
    protected bvhCharacter?: boolean

    protected _physics?: PhysicsOptions
    public get physics() {
        return this._physics ?? false
    }
    public set physics(val) {
        this._physics = val
        this.refreshPhysics()
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
        this.positionUpdate?.updateX()
    }

    public override get y() {
        return super.y
    }
    public override set y(val) {
        super.y = val
        this.positionUpdate?.updateY()
    }

    public override get z() {
        return super.z
    }
    public override set z(val) {
        super.z = val
        this.positionUpdate?.updateZ()
    }

    public override get rotationX() {
        return super.rotationX
    }
    public override set rotationX(val) {
        super.rotationX = val
        this.rotationUpdate?.updateX()
    }

    public override get rotationY() {
        return super.rotationY
    }
    public override set rotationY(val) {
        super.rotationY = val
        this.rotationUpdate?.updateY()
    }

    public override get rotationZ() {
        return super.rotationZ
    }
    public override set rotationZ(val) {
        super.rotationZ = val
        this.rotationUpdate?.updateZ()
    }

    public override lookAt(target: MeshItem | Point3d): void
    public override lookAt(x: number, y: number | undefined, z: number): void
    public override lookAt(a0: any, a1?: any, a2?: any) {
        super.lookAt(a0, a1, a2)
        this.rotationUpdate?.updateXYZ()
    }

    public override placeAt(object: MeshItem | Point3d | string) {
        super.placeAt(object)
        this.positionUpdate?.updateXYZ()
        this.rotationUpdate?.updateXYZ()
        characterCameraPlaced.add(this)
    }

    public override lerpTo(x: number, y: number, z: number, alpha: number) {
        super.lerpTo(x, y, z, alpha, () => this.positionUpdate?.updateXYZ())
    }

    public override moveTo(
        x: number,
        y: number | undefined,
        z: number,
        speed: number
    ) {
        super.moveTo(x, y, z, speed, (y) =>
            y === undefined
                ? this.positionUpdate?.updateXZ()
                : this.positionUpdate?.updateXYZ()
        )
    }
}
