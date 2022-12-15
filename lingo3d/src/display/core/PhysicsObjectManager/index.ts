import { Object3D } from "three"
import { deg2Rad, Point3d } from "@lincode/math"
import SimpleObjectManager from "../SimpleObjectManager"
import IPhysicsObjectManager, {
    PhysicsOptions
} from "../../../interface/IPhysicsObjectManager"
import { getPhysX } from "../../../states/usePhysX"
import getActualScale from "../../utils/getActualScale"
import { Reactive } from "@lincode/reactivity"
import objectActorMap, { objectCharacterActorMap } from "./physx/objectActorMap"
import threeScene from "../../../engine/scene"
import { onBeforeRender } from "../../../events/onBeforeRender"
import { FRAME2SEC } from "../../../globals"
import { dtPtr } from "../../../engine/eventLoop"
import destroy from "./physx/destroy"

const managerControllerMap = new WeakMap<PhysicsObjectManager, [any, any]>()
let pxVec: any
getPhysX((val) => (pxVec = val.pxVec))

export default class PhysicsObjectManager<T extends Object3D = Object3D>
    extends SimpleObjectManager<T>
    implements IPhysicsObjectManager
{
    public get velocity(): Point3d {
        return new Point3d(0, 0, 0)
    }
    public set velocity(val) {}

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
                getPxControllerManager,
                getPxControllerFilters
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
                const filters = getPxControllerFilters()
                const actor = controller.getActor()
                objectCharacterActorMap.set(this.outerObject3d, actor)

                const handle = onBeforeRender(() => {
                    pxVec.set_x(0)
                    pxVec.set_y(-9.81 * FRAME2SEC * FRAME2SEC * 10)
                    pxVec.set_z(0)
                    controller.move(pxVec, 0.001, dtPtr[0], filters)
                })
                return () => {
                    handle.cancel()
                    destroy(desc)
                    destroy(controller)
                    objectCharacterActorMap.delete(this.outerObject3d)
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
                destroy(shape)
                scene.removeActor(actor)
                destroy(actor)
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

    public override moveForward(distance: number) {}

    public override moveRight(distance: number) {}
}
