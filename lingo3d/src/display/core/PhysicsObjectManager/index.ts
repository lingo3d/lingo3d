import { Object3D, Vector3 } from "three"
import { deg2Rad, Point3d } from "@lincode/math"
import SimpleObjectManager from "../SimpleObjectManager"
import IPhysicsObjectManager, {
    PhysicsOptions
} from "../../../interface/IPhysicsObjectManager"
import StaticObjectManager from "../StaticObjectManager"
import bvhContactMap from "./bvh/bvhContactMap"
import MeshItem from "../MeshItem"
import characterCameraPlaced from "../CharacterCamera/characterCameraPlaced"
import PhysicsUpdate from "./PhysicsUpdate"
import { getPhysX } from "../../../states/usePhysX"
import getActualScale from "../../utils/getActualScale"
import { Reactive } from "@lincode/reactivity"
import objectActorMap, { objectCharacterActorMap } from "./physx/objectActorMap"
import threeScene from "../../../engine/scene"
import { dtPtr } from "../../../engine/eventLoop"
import { onBeforeRender } from "../../../events/onBeforeRender"

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

    protected bvhVelocity?: Vector3
    protected bvhOnGround?: boolean
    protected bvhRadius?: number
    protected bvhHalfHeight?: number
    protected bvhMap?: boolean
    protected bvhCharacter?: boolean

    protected getPxShape(_: PhysicsOptions, actor: any) {
        const { material, shapeFlags, physics, PxBoxGeometry } = getPhysX()

        const { x, y, z } = getActualScale(this).multiplyScalar(0.5)
        const pxGeometry = new PxBoxGeometry(x, y, z)
        // destroy(geometry)
        const shape = physics.createShape(
            pxGeometry,
            material,
            true,
            shapeFlags
        )
        actor.attachShape(shape)
        return shape
    }

    private _physicsState?: Reactive<PhysicsOptions>
    protected get physicsState() {
        return (this._physicsState ??= new Reactive<PhysicsOptions>(false))
    }
    private physicsInitialized?: boolean
    protected refreshPhysics(val: PhysicsOptions) {
        const { physicsState } = this
        physicsState.set(val)

        if (this.physicsInitialized) return
        this.physicsInitialized = true

        import("./physx")

        this.createEffect(() => {
            const mode = physicsState.get()
            const {
                physics,
                pxVec,
                pxGravityVec,
                pxPose,
                pxFilterData,
                scene,
                pxQuat,
                PxCapsuleControllerDesc,
                PxCapsuleClimbingModeEnum,
                PxControllerNonWalkableModeEnum,
                material,
                controllerManager,
                pxControllerFilters,
                PxForceModeEnum
            } = getPhysX()
            if (!physics || !mode) return

            this.outerObject3d.parent !== threeScene &&
                threeScene.attach(this.outerObject3d)

            const { position, quaternion } = this.outerObject3d

            if (mode === "character") {
                const desc = new PxCapsuleControllerDesc()
                desc.height = 1.7
                desc.radius = 0.5
                desc.position.x = position.x
                desc.position.y = position.y
                desc.position.z = position.z
                desc.climbingMode = PxCapsuleClimbingModeEnum.eEASY()
                desc.nonWalkableMode =
                    PxControllerNonWalkableModeEnum.ePREVENT_CLIMBING()
                desc.slopeLimit = Math.cos(50 * deg2Rad)
                desc.material = material
                desc.contactOffset = 0.1
                // desc.reportCallback = hitCallback.callback
                // desc.behaviorCallback = behaviorCallback.callback
                const controller = controllerManager.createController(desc)
                const actor = controller.getActor()
                objectCharacterActorMap.set(this.outerObject3d, actor)
                console.log(actor.addForce)
                actor.addForce(pxGravityVec, PxForceModeEnum.eACCELERATION)

                // const handle = onBeforeRender(() => {
                //     pxVec.set_x(0.1)
                //     pxVec.set_y(0.1)
                //     pxVec.set_z(0.1)

                //     pxCharacter.move(
                //         pxVec,
                //         0.001,
                //         dtPtr[0],
                //         pxControllerFilters
                //     )
                // })
                return () => {
                    // handle.cancel()
                }
            }

            pxVec.set_x(position.x)
            pxVec.set_y(position.y)
            pxVec.set_z(position.z)

            pxQuat.set_x(quaternion.x)
            pxQuat.set_y(quaternion.y)
            pxQuat.set_z(quaternion.z)
            pxQuat.set_w(quaternion.w)

            pxPose.set_p(pxVec)
            pxPose.set_q(pxQuat)

            const actor =
                mode === "map"
                    ? physics.createRigidStatic(pxPose)
                    : physics.createRigidDynamic(pxPose)

            const shape = this.getPxShape(mode, actor)
            shape.setSimulationFilterData(pxFilterData)
            scene.addActor(actor)

            objectActorMap.set(this.outerObject3d, actor)

            return () => {
                scene.removeActor(actor)
                actor.release()
                shape.release()
                objectActorMap.delete(this.outerObject3d)
            }
        }, [physicsState.get, getPhysX])
    }

    public get physics() {
        return this.physicsState?.get() ?? false
    }
    public set physics(val) {
        this.refreshPhysics(val)
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
