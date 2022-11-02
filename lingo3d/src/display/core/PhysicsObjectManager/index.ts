import { Object3D, Vector3 } from "three"
import { Point3d } from "@lincode/math"
import SimpleObjectManager from "../SimpleObjectManager"
import IPhysicsObjectManager, {
    PhysicsOptions
} from "../../../interface/IPhysicsObjectManager"
import StaticObjectManager from "../StaticObjectManager"
import bvhContactMap from "./bvh/bvhContactMap"
import MeshItem from "../MeshItem"
import characterCameraPlaced from "../CharacterCamera/characterCameraPlaced"
import PhysicsUpdate from "./PhysicsUpdate"
import { Reactive } from "@lincode/reactivity"
import scene from "../../../engine/scene"
import { Cancellable } from "@lincode/promiselikes"

export default class PhysicsObjectManager<T extends Object3D = Object3D>
    extends SimpleObjectManager<T>
    implements IPhysicsObjectManager
{
    public get velocity(): Point3d {
        if (this.bvhVelocity) return this.bvhVelocity
        return new Point3d(0, 0, 0)
    }
    public set velocity(val) {
        if (this.bvhVelocity) Object.assign(this.bvhVelocity, val)
    }

    protected positionUpdate?: PhysicsUpdate
    protected rotationUpdate?: PhysicsUpdate

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
                handle.then(() => {})
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
