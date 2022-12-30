import { Object3D } from "three"
import { deg2Rad, Point3d } from "@lincode/math"
import SimpleObjectManager from "../SimpleObjectManager"
import IPhysicsObjectManager, {
    PhysicsOptions
} from "../../../interface/IPhysicsObjectManager"
import { getPhysX } from "../../../states/usePhysX"
import getActualScale from "../../utils/getActualScale"
import { Reactive } from "@lincode/reactivity"
import {
    actorPtrManagerMap,
    managerActorMap,
    managerActorPtrMap,
    managerControllerMap,
    managerShapeLinkMap
} from "./physx/pxMaps"
import threeScene from "../../../engine/scene"
import destroy from "./physx/destroy"
import { assignPxPose, setPxVec, setPxVec_ } from "./physx/updatePxVec"
import SpawnPoint from "../../SpawnPoint"
import MeshItem from "../MeshItem"
import {
    pxUpdateSet,
    pxVXUpdateMap,
    pxVYUpdateMap,
    pxVZUpdateMap
} from "./physx/physxLoop"
import Nullable from "../../../interface/utils/Nullable"
import { Cancellable } from "@lincode/promiselikes"

export default class PhysicsObjectManager<T extends Object3D = Object3D>
    extends SimpleObjectManager<T>
    implements IPhysicsObjectManager
{
    public actor?: any
    public capsuleHeight?: number

    private _mass?: number
    public get mass(): number {
        return this.actor?.getMass() ?? this._mass ?? 1
    }
    public set mass(val) {
        this._mass = val
        this.actor?.setMass(val)
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
        const { PxRigidBodyExt } = getPhysX()
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
        const { PxRigidBodyExt } = getPhysX()
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

    protected getPxShape(_: PhysicsOptions, actor: any) {
        const { material, shapeFlags, physics, PxBoxGeometry, pxFilterData } =
            getPhysX()

        const { x, y, z } = getActualScale(this).multiplyScalar(0.5)
        const pxGeometry = new PxBoxGeometry(x, y, z)
        const shape = physics.createShape(
            pxGeometry,
            material,
            true,
            shapeFlags
        )
        shape.setSimulationFilterData(pxFilterData)
        destroy(pxGeometry)
        actor.attachShape(shape)
        return shape
    }

    private refreshPhysicsState?: Reactive<{}>
    protected refreshPhysics() {
        if (this.refreshPhysicsState) {
            this.refreshPhysicsState.set({})
            return
        }
        this.refreshPhysicsState = new Reactive({})
        import("./physx")

        this.createEffect(() => {
            const { _physics } = this
            const {
                physics,
                scene,
                PxCapsuleControllerDesc,
                PxCapsuleClimbingModeEnum,
                PxControllerNonWalkableModeEnum,
                material,
                getPxControllerManager,
                PxRigidBodyExt,
                PxArticulationJointTypeEnum,
                PxArticulationAxisEnum,
                PxArticulationMotionEnum
            } = getPhysX()
            if (!physics || !_physics) return

            const ogParent = this.outerObject3d.parent
            ogParent !== threeScene && threeScene.attach(this.outerObject3d)

            this.object3d.userData.physx = true

            if (_physics === "articulation") {
                const articulation =
                    physics.createArticulationReducedCoordinate()

                const rootLink = articulation.createLink(
                    null,
                    assignPxPose(this.outerObject3d)
                )
                const rootShape = this.getPxShape(true, rootLink)
                PxRigidBodyExt.prototype.updateMassAndInertia(
                    rootLink,
                    this.mass
                )
                managerShapeLinkMap.set(this, [rootShape, rootLink])
                actorPtrManagerMap.set(rootLink.ptr, this)

                const handle = new Cancellable()
                const traverse = (
                    parentManager: PhysicsObjectManager,
                    parentLink: any
                ) => {
                    const [childManager] = parentManager.children ?? []
                    if (!(childManager instanceof PhysicsObjectManager)) return

                    const ogParent = childManager.outerObject3d.parent
                    ogParent !== threeScene &&
                        threeScene.attach(childManager.outerObject3d)

                    const childLink = articulation.createLink(
                        parentLink,
                        assignPxPose(childManager.outerObject3d)
                    )
                    const childShape = childManager.getPxShape(true, childLink)
                    PxRigidBodyExt.prototype.updateMassAndInertia(
                        childLink,
                        childManager.mass
                    )
                    managerShapeLinkMap.set(childManager, [
                        childShape,
                        childLink
                    ])
                    actorPtrManagerMap.set(childLink.ptr, childManager)

                    const joint = childLink.getInboundJoint()
                    // joint.setParentPose(
                    //     assignPxPose(childManager.outerObject3d)
                    // )
                    // joint.setChildPose(
                    //     assignPxPose(parentManager.outerObject3d)
                    // )
                    joint.setJointType(PxArticulationJointTypeEnum.eREVOLUTE())
                    joint.setMotion(
                        PxArticulationAxisEnum.eTWIST(),
                        PxArticulationMotionEnum.eFREE()
                    )
                    joint.setMotion(
                        PxArticulationAxisEnum.eSWING1(),
                        PxArticulationMotionEnum.eFREE()
                    )
                    joint.setMotion(
                        PxArticulationAxisEnum.eSWING2(),
                        PxArticulationMotionEnum.eFREE()
                    )
                    handle.then(() => {
                        destroy(joint)
                        destroy(childLink)
                        destroy(childShape)
                        managerShapeLinkMap.delete(childManager)
                        actorPtrManagerMap.delete(childLink.ptr)

                        ogParent !== threeScene &&
                            ogParent?.attach(childManager.outerObject3d)
                    })
                    traverse(childManager, childLink)
                }
                traverse(this, rootLink)

                scene.addArticulation(articulation)

                return () => {
                    handle.cancel()

                    destroy(rootLink)
                    destroy(rootShape)
                    managerShapeLinkMap.delete(this)
                    actorPtrManagerMap.delete(rootLink.ptr)

                    scene.removeActor(articulation)
                    destroy(articulation)

                    ogParent !== threeScene &&
                        ogParent?.attach(this.outerObject3d)
                }
            }

            if (_physics === "character") {
                const desc = new PxCapsuleControllerDesc()
                const { x, y } = getActualScale(this).multiplyScalar(0.5)
                this.capsuleHeight = y * 2
                desc.height = y * 1.2
                desc.radius = x
                Object.assign(desc.position, this.outerObject3d.position)
                desc.climbingMode = PxCapsuleClimbingModeEnum.eEASY()
                desc.nonWalkableMode =
                    PxControllerNonWalkableModeEnum.ePREVENT_CLIMBING()
                desc.slopeLimit = Math.cos(45 * deg2Rad)
                desc.material = material
                desc.contactOffset = 0.1
                // desc.stepOffset = y * 0.4
                // desc.maxJumpHeight = 0.1

                // desc.reportCallback = hitCallback.callback
                // desc.behaviorCallback = behaviorCallback.callback
                const controller =
                    getPxControllerManager().createController(desc)
                destroy(desc)

                const actor = this.initActor(controller.getActor())
                managerControllerMap.set(this, controller)

                return () => {
                    actorPtrManagerMap.delete(actor.ptr)
                    destroy(controller)
                    managerControllerMap.delete(this)
                    this.actor = undefined
                    this.object3d.userData.physx = false
                }
            }

            const pxPose = assignPxPose(this.outerObject3d)
            const actor = this.initActor(
                _physics === "map"
                    ? physics.createRigidStatic(pxPose)
                    : physics.createRigidDynamic(pxPose)
            )
            const shape = this.getPxShape(_physics, actor)
            scene.addActor(actor)

            managerActorMap.set(this, actor)

            return () => {
                actorPtrManagerMap.delete(actor.ptr)
                destroy(shape)
                scene.removeActor(actor)
                destroy(actor)
                managerActorMap.delete(this)
                this.actor = undefined
                this.object3d.userData.physx = false
            }
        }, [this.refreshPhysicsState.get, getPhysX])
    }

    private _physics?: PhysicsOptions
    public get physics() {
        return this._physics
    }
    public set physics(val) {
        this._physics = val
        this.refreshPhysics()
    }

    private pxUpdate() {
        this.actor && pxUpdateSet.add(this)
    }

    public override moveForward(distance: number) {
        super.moveForward(distance)
        this.pxUpdate()
    }

    public override moveRight(distance: number) {
        super.moveRight(distance)
        this.pxUpdate()
    }

    public override placeAt(target: string | Point3d | MeshItem | SpawnPoint) {
        super.placeAt(target)
        this.pxUpdate()
    }

    public override lerpTo(x: number, y: number, z: number, alpha: number) {
        super.lerpTo(x, y, z, alpha, () => this.pxUpdate())
    }

    public override moveTo(
        x: number,
        y: number | undefined,
        z: number,
        speed: number
    ) {
        super.moveTo(x, y, z, speed, () => this.pxUpdate())
    }

    public override get x() {
        return super.x
    }
    public override set x(val) {
        super.x = val
        this.pxUpdate()
    }

    public override get y() {
        return super.y
    }
    public override set y(val) {
        super.y = val
        this.pxUpdate()
    }

    public override get z() {
        return super.z
    }
    public override set z(val) {
        super.z = val
        this.pxUpdate()
    }
}
