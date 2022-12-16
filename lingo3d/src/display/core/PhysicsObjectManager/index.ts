import { Object3D } from "three"
import { deg2Rad, Point3d } from "@lincode/math"
import SimpleObjectManager from "../SimpleObjectManager"
import IPhysicsObjectManager, {
    PhysicsOptions
} from "../../../interface/IPhysicsObjectManager"
import { getPhysX } from "../../../states/usePhysX"
import getActualScale from "../../utils/getActualScale"
import { Reactive } from "@lincode/reactivity"
import { managerActorMap, managerControllerMap } from "./physx/pxMaps"
import threeScene from "../../../engine/scene"
import { dtPtr, fpsRatioPtr } from "../../../engine/eventLoop"
import destroy from "./physx/destroy"
import { scaleDown } from "../../../engine/constants"
import { vector3 } from "../../utils/reusables"
import { assignPxVec, setPxVec } from "./physx/updatePxVec"
import SpawnPoint from "../../SpawnPoint"
import MeshItem from "../MeshItem"

let filters: any
getPhysX((val) => (filters = val.getPxControllerFilters?.()))

export default class PhysicsObjectManager<T extends Object3D = Object3D>
    extends SimpleObjectManager<T>
    implements IPhysicsObjectManager
{
    private actor?: any

    public get velocity(): Point3d {
        if (this.actor) return this.actor.getLinearVelocity()
        return new Point3d(0, 0, 0)
    }
    public set velocity(val) {
        this.actor?.setLinearVelocity(assignPxVec(val))
    }

    private _mass?: number
    public get mass(): number {
        return this.actor?.getMass() ?? this._mass ?? 0
    }
    public set mass(val) {
        this._mass = val
        this.actor?.setMass(val)
    }

    private initActor(actor: any) {
        this.actor = actor
        if (this._mass !== undefined) actor.mass = this._mass
        return actor
    }

    protected getPxShape(_: PhysicsOptions, actor: any) {
        const { material, shapeFlags, physics, PxBoxGeometry } = getPhysX()

        const { x, y, z } = getActualScale(this).multiplyScalar(0.5)
        const pxGeometry = new PxBoxGeometry(x, y, z)
        const shape = physics.createShape(
            pxGeometry,
            material,
            true,
            shapeFlags
        )
        destroy(pxGeometry)
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
                pxPose,
                pxFilterData,
                scene,
                pxQuat,
                PxCapsuleControllerDesc,
                PxCapsuleClimbingModeEnum,
                PxControllerNonWalkableModeEnum,
                material,
                getPxControllerManager
            } = getPhysX()
            if (!physics || !mode) return

            this.outerObject3d.parent !== threeScene &&
                threeScene.attach(this.outerObject3d)

            const { position, quaternion } = this.outerObject3d

            if (mode === "character") {
                const desc = new PxCapsuleControllerDesc()
                const { x, y } = getActualScale(this).multiplyScalar(0.5)
                desc.height = y * 1.2
                desc.radius = x
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
                const controller =
                    getPxControllerManager().createController(desc)
                destroy(desc)

                this.initActor(controller.getActor())

                managerControllerMap.set(this, controller)

                return () => {
                    destroy(controller)
                    managerControllerMap.delete(this)
                    this.actor = undefined
                }
            }

            pxQuat.set_x(quaternion.x)
            pxQuat.set_y(quaternion.y)
            pxQuat.set_z(quaternion.z)
            pxQuat.set_w(quaternion.w)

            pxPose.set_p(assignPxVec(position))
            pxPose.set_q(pxQuat)

            const actor = this.initActor(
                mode === "map"
                    ? physics.createRigidStatic(pxPose)
                    : physics.createRigidDynamic(pxPose)
            )

            const shape = this.getPxShape(mode, actor)
            shape.setSimulationFilterData(pxFilterData)
            scene.addActor(actor)

            managerActorMap.set(this, actor)

            return () => {
                destroy(shape)
                scene.removeActor(actor)
                destroy(actor)
                managerActorMap.delete(this)
                this.actor = undefined
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

    public pxUpdate?: boolean

    public override moveForward(distance: number) {
        const controller = managerControllerMap.get(this)
        if (controller) {
            vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
            vector3.crossVectors(this.outerObject3d.up, vector3)
            const { position } = this.outerObject3d
            const targetPos = position
                .clone()
                .addScaledVector(vector3, distance * scaleDown * fpsRatioPtr[0])

            controller.move(
                setPxVec(targetPos.x - position.x, 0, targetPos.z - position.z),
                0.001,
                dtPtr[0],
                filters
            )
            return
        }
        super.moveForward(distance)
        this.pxUpdate = true
    }

    public override moveRight(distance: number) {
        const controller = managerControllerMap.get(this)
        if (controller) {
            vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
            const { position } = this.outerObject3d
            const targetPos = position
                .clone()
                .addScaledVector(vector3, distance * scaleDown * fpsRatioPtr[0])

            controller.move(
                setPxVec(targetPos.x - position.x, 0, targetPos.z - position.z),
                0.001,
                dtPtr[0],
                filters
            )
            return
        }
        super.moveRight(distance)
        this.pxUpdate = true
    }

    public override placeAt(target: string | Point3d | MeshItem | SpawnPoint) {
        super.placeAt(target)
        this.pxUpdate = true
    }

    public override lerpTo(x: number, y: number, z: number, alpha: number) {
        super.lerpTo(x, y, z, alpha, () => (this.pxUpdate = true))
    }

    public override moveTo(
        x: number,
        y: number | undefined,
        z: number,
        speed: number
    ) {
        super.moveTo(x, y, z, speed, () => (this.pxUpdate = true))
    }

    public override get x() {
        return super.x
    }
    public override set x(val) {
        super.x = val
        this.pxUpdate = true
    }

    public override get y() {
        return super.y
    }
    public override set y(val) {
        super.y = val
        this.pxUpdate = true
    }

    public override get z() {
        return super.z
    }
    public override set z(val) {
        super.z = val
        this.pxUpdate = true
    }
}
