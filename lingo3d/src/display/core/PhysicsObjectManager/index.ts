import { Object3D } from "three"
import { deg2Rad, Point3d } from "@lincode/math"
import IPhysicsObjectManager, {
    PhysicsOptions
} from "../../../interface/IPhysicsObjectManager"
import getActualScale from "../../utils/getActualScale"
import { Reactive, store } from "@lincode/reactivity"
import {
    actorPtrManagerMap,
    controllerManagerContactMap,
    controllerManagerMap,
    managerActorMap,
    managerActorPtrMap,
    managerContactMap,
    managerControllerMap
} from "./physx/pxMaps"
import scene from "../../../engine/scene"
import destroy from "./physx/destroy"
import { assignPxTransform, setPxVec, setPxVec_ } from "./physx/pxMath"
import SpawnPoint from "../../SpawnPoint"
import {
    pxUpdateSet,
    pxVXUpdateMap,
    pxVYUpdateMap,
    pxVZUpdateMap
} from "./physx/physxLoop"
import Nullable from "../../../interface/utils/Nullable"
import MeshAppendable from "../../../api/core/MeshAppendable"
import cookConvexGeometry, {
    decreaseConvexGeometryCount
} from "./physx/cookConvexGeometry"
import { physxPtr } from "./physx/physxPtr"
import { getPhysXLoaded } from "../../../states/usePhysXLoaded"
import { lazy } from "@lincode/utils"
import {
    decreaseLoadingUnpkgCount,
    increaseLoadingUnpkgCount
} from "../../../states/useLoadingUnpkgCount"
import VisibleObjectManager from "../VisibleObjectManager"

const importPhysX = lazy(async () => {
    increaseLoadingUnpkgCount()
    await import("./physx")
    decreaseLoadingUnpkgCount()
})

export default class PhysicsObjectManager<T extends Object3D = Object3D>
    extends VisibleObjectManager<T>
    implements IPhysicsObjectManager
{
    public actor?: any
    public capsuleHeight?: number

    private _mass?: number
    public get mass(): number {
        if (this.actor && !this.actor.getMass) return 0
        return this.actor?.getMass() ?? this._mass ?? 1
    }
    public set mass(val) {
        this._mass = val
        this.actor?.setMass?.(val)
    }

    public gravity: Nullable<boolean>

    public get velocityX(): number {
        return this.actor?.getLinearVelocity().get_x() ?? 0
    }
    public set velocityX(val) {
        const { actor } = this
        if (!actor) return

        if (this._physics === "character") {
            pxVXUpdateMap.set(this, val)
            return
        }
        const velocity = actor.getLinearVelocity()
        velocity.set_x(val)
        actor.setLinearVelocity(velocity)
    }

    public get velocityY(): number {
        return this.actor?.getLinearVelocity().get_y() ?? 0
    }
    public set velocityY(val) {
        const { actor } = this
        if (!actor) return

        if (this._physics === "character") {
            pxVYUpdateMap.set(this, val)
            return
        }
        const velocity = actor.getLinearVelocity()
        velocity.set_y(val)
        actor.setLinearVelocity(velocity)
    }

    public get velocityZ(): number {
        return this.actor?.getLinearVelocity().get_z() ?? 0
    }
    public set velocityZ(val) {
        const { actor } = this
        if (!actor) return

        if (this._physics === "character") {
            pxVZUpdateMap.set(this, val)
            return
        }
        const velocity = actor.getLinearVelocity()
        velocity.set_z(val)
        actor.setLinearVelocity(velocity)
    }

    public addForce(x: number, y: number, z: number) {
        this.actor?.addForce(setPxVec(x, y, z))
    }

    public addLocalForceAtPos(
        x: number,
        y: number,
        z: number,
        posX = 0,
        posY = 0,
        posZ = 0
    ) {
        const { PxRigidBodyExt } = physxPtr[0]
        if (!PxRigidBodyExt || !this.actor) return

        PxRigidBodyExt.prototype.addLocalForceAtPos(
            this.actor,
            setPxVec(x, y, z),
            setPxVec_(posX, posY, posZ)
        )
    }

    public addLocalForceAtLocalPos(
        x: number,
        y: number,
        z: number,
        posX = 0,
        posY = 0,
        posZ = 0
    ) {
        const { PxRigidBodyExt } = physxPtr[0]
        if (!PxRigidBodyExt || !this.actor) return

        PxRigidBodyExt.prototype.addLocalForceAtLocalPos(
            this.actor,
            setPxVec(x, y, z),
            setPxVec_(posX, posY, posZ)
        )
    }

    public addTorque(x: number, y: number, z: number) {
        this.actor?.addTorque(setPxVec(x, y, z))
    }

    private initActor(actor: any) {
        this.actor = actor
        const { _mass } = this
        if (_mass !== undefined) actor.mass = _mass
        actorPtrManagerMap.set(actor.ptr, this)
        managerActorPtrMap.set(this, actor.ptr)
        return actor
    }

    public convexParamString?: string
    protected override disposeNode() {
        super.disposeNode()
        decreaseConvexGeometryCount(this)
    }
    protected getPxShape(_: PhysicsOptions, actor: any) {
        const { material, shapeFlags, PxRigidActorExt, pxFilterData } =
            physxPtr[0]

        const shape: any = PxRigidActorExt.prototype.createExclusiveShape(
            actor,
            cookConvexGeometry(this.componentName, this),
            material,
            shapeFlags
        )
        shape.setSimulationFilterData(pxFilterData)
        return shape
    }

    public refreshPhysicsState?: Reactive<{}>
    private refreshShapeState?: Reactive<{}>
    public refreshPhysics() {
        if (this.refreshPhysicsState) {
            this.refreshPhysicsState.set({})
            return
        }
        this.refreshPhysicsState = new Reactive({})
        this.refreshShapeState = new Reactive({})

        importPhysX()

        const [setMode, getMode] = store<PhysicsOptions>(false)
        this.createEffect(() => {
            setMode(this._physics || !!this._jointCount)
        }, [this.refreshPhysicsState.get])

        this.createEffect(() => {
            const mode = getMode()
            const {
                physics,
                pxScene,
                PxCapsuleControllerDesc,
                PxCapsuleClimbingModeEnum,
                PxControllerNonWalkableModeEnum,
                material,
                getPxControllerManager,
                controllerHitCallback
            } = physxPtr[0]
            if (!physics || !mode) return

            const ogParent = this.outerObject3d.parent
            ogParent !== scene && scene.attach(this.outerObject3d)

            if (mode === "character") {
                const desc = new PxCapsuleControllerDesc()
                const { x, y } = getActualScale(this).multiplyScalar(0.5)
                this.capsuleHeight = y * 2
                desc.height = y * 1.2
                desc.radius = x
                Object.assign(desc.position, this.position)
                desc.climbingMode = PxCapsuleClimbingModeEnum.eEASY()
                desc.nonWalkableMode =
                    PxControllerNonWalkableModeEnum.ePREVENT_CLIMBING()
                desc.slopeLimit = Math.cos(45 * deg2Rad)
                desc.material = material
                desc.contactOffset = 0.1
                // desc.stepOffset = y * 0.4
                // desc.maxJumpHeight = 0.1

                desc.reportCallback = controllerHitCallback
                // desc.behaviorCallback = behaviorCallback.callback
                const controller =
                    getPxControllerManager().createController(desc)
                destroy(desc)

                const actor = this.initActor(controller.getActor())
                managerControllerMap.set(this, controller)
                controllerManagerMap.set(controller, this)

                return () => {
                    actorPtrManagerMap.delete(actor.ptr)
                    destroy(controller)
                    managerControllerMap.delete(this)
                    controllerManagerMap.delete(controller)
                    pxUpdateSet.delete(this)
                    this.actor = undefined
                }
            }

            const pxTransform = assignPxTransform(this)
            const isStatic = mode === "map" || mode === "static"
            const actor = this.initActor(
                isStatic
                    ? physics.createRigidStatic(pxTransform)
                    : physics.createRigidDynamic(pxTransform)
            )

            this.getPxShape(mode, actor)
            pxScene.addActor(actor)
            managerActorMap.set(this, actor)

            return () => {
                pxScene.removeActor(actor)
                destroy(actor)

                actorPtrManagerMap.delete(actor.ptr)
                managerActorMap.delete(this)
                pxUpdateSet.delete(this)
                this.actor = undefined
            }
        }, [getMode, getPhysXLoaded, this.refreshShapeState.get])
    }

    private _physics?: PhysicsOptions
    public get physics() {
        return this._physics
    }
    public set physics(val) {
        this._physics = val
        this.refreshPhysics()
    }

    private _jointCount?: number
    public get jointCount() {
        return this._jointCount ?? 0
    }
    public set jointCount(val) {
        this._jointCount = val
        this.refreshPhysics()
    }

    public updatePhysics() {
        this.actor && pxUpdateSet.add(this)
    }
    public updatePhysicsShape() {
        this.refreshShapeState?.set({})
    }

    //@ts-ignore
    public override moveForward(distance: number) {
        super.moveForward(distance)
        this.updatePhysics()
    }

    //@ts-ignore
    public override moveRight(distance: number) {
        super.moveRight(distance)
        this.updatePhysics()
    }

    //@ts-ignore
    public override placeAt(
        target: string | Point3d | MeshAppendable | SpawnPoint
    ) {
        super.placeAt(target)
        this.updatePhysics()
    }

    //@ts-ignore
    public override lerpTo(x: number, y: number, z: number, alpha?: number) {
        super.lerpTo(x, y, z, alpha, () => this.updatePhysics())
    }

    //@ts-ignore
    public override moveTo(
        x: number,
        y: number | undefined,
        z: number,
        speed?: number
    ) {
        super.moveTo(x, y, z, speed, () => this.updatePhysics())
    }

    public override get x() {
        return super.x
    }
    public override set x(val) {
        super.x = val
        this.updatePhysics()
    }

    public override get y() {
        return super.y
    }
    public override set y(val) {
        super.y = val
        this.updatePhysics()
    }

    public override get z() {
        return super.z
    }
    public override set z(val) {
        super.z = val
        this.updatePhysics()
    }

    public override get rotationX() {
        return super.rotationX
    }
    public override set rotationX(val) {
        super.rotationX = val
        this.updatePhysics()
    }

    public override get rotationY() {
        return super.rotationY
    }
    public override set rotationY(val) {
        super.rotationY = val
        this.updatePhysics()
    }

    public override get rotationZ() {
        return super.rotationZ
    }
    public override set rotationZ(val) {
        super.rotationZ = val
        this.updatePhysics()
    }

    public override get scaleX() {
        return super.scaleX
    }
    public override set scaleX(val) {
        super.scaleX = val
        this.updatePhysicsShape()
    }

    public override get scaleY() {
        return super.scaleY
    }
    public override set scaleY(val) {
        super.scaleY = val
        this.updatePhysicsShape()
    }

    public override get scaleZ() {
        return super.scaleZ
    }
    public override set scaleZ(val) {
        super.scaleZ = val
        this.updatePhysicsShape()
    }

    //@ts-ignore
    public override hitTest(target: MeshAppendable | PhysicsObjectManager) {
        if (this._physics && "_physics" in target && target._physics) {
            if (this._physics === "character")
                return !!controllerManagerContactMap.get(this)?.has(target)
            if (target._physics === "character")
                return !!controllerManagerContactMap.get(target)?.has(this)
            return !!managerContactMap.get(this)?.has(target)
        }
        return super.hitTest(target)
    }
}
