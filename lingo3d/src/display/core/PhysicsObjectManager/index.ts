import { BufferAttribute, BufferGeometry, Mesh, Object3D, Vector3 } from "three"
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
import scene from "../../../engine/scene"
import { getPhysX } from "../../../states/usePhysX"
import getActualScale from "../../utils/getActualScale"
import { Reactive } from "@lincode/reactivity"
import objectActorMap from "./physx/objectActorMap"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
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

    private _physicsState?: Reactive<PhysicsOptions>
    protected get physicsState() {
        return (this._physicsState ??= new Reactive<PhysicsOptions>(false))
    }
    protected physicsMeshGroup?: Object3D
    private physicsInitialized?: boolean
    protected refreshPhysics(val: PhysicsOptions) {
        const { physicsState } = this
        physicsState.set(val)

        if (this.physicsInitialized) return
        this.physicsInitialized = true

        import("./physx")
        this.outerObject3d.parent !== scene && scene.attach(this.outerObject3d)

        this.createEffect(() => {
            const {
                PhysX,
                physics,
                material,
                shapeFlags,
                tmpVec,
                tmpPose,
                tmpFilterData,
                scene,
                cooking,
                convexFlags,
                insertionCallback
            } = getPhysX()
            if (!PhysX) return

            const mode = physicsState.get()
            const { x, y, z } = this.outerObject3d.position

            tmpVec.set_x(x)
            tmpVec.set_y(y)
            tmpVec.set_z(z)
            tmpPose.set_p(tmpVec)

            const actor =
                mode === "map"
                    ? physics.createRigidStatic(tmpPose)
                    : physics.createRigidDynamic(tmpPose)

            let shape: any
            if (mode === "character") {
                const halfScale = getActualScale(this).multiplyScalar(0.5)
                const pxGeometry = new PhysX.PxCapsuleGeometry(
                    halfScale.x,
                    halfScale.y
                )
                shape = PhysX.PxRigidActorExt.prototype.createExclusiveShape(
                    actor,
                    pxGeometry,
                    material
                )
            } else if (mode === "convex" && this.physicsMeshGroup) {
                const geometries: Array<BufferGeometry> = []
                this.physicsMeshGroup.traverse(
                    (c: Object3D | Mesh) =>
                        "geometry" in c && geometries.push(c.geometry)
                )
                const geometry =
                    BufferGeometryUtils.mergeBufferGeometries(geometries)

                const { x, y, z } = this.physicsMeshGroup.scale
                geometry.scale(x, y, z)
                geometry.dispose()

                const buffer = geometry.attributes.position
                const vertices = buffer.array

                const vec3Vector = new PhysX.Vector_PxVec3(buffer.count)
                for (let i = 0; i < buffer.count; i++) {
                    const pxVec3 = vec3Vector.at(i)
                    const offset = i * 3
                    pxVec3.set_x(vertices[offset])
                    pxVec3.set_y(vertices[offset + 1])
                    pxVec3.set_z(vertices[offset + 2])
                }

                const desc = new PhysX.PxConvexMeshDesc()
                desc.flags = convexFlags
                desc.points.count = buffer.count
                desc.points.stride = 12
                desc.points.data = vec3Vector.data()

                const convexMesh = cooking.createConvexMesh(
                    desc,
                    insertionCallback
                )

                // vec3Vector.destroy()

                const pxGeometry = new PhysX.PxConvexMeshGeometry(convexMesh)
                shape = PhysX.PxRigidActorExt.prototype.createExclusiveShape(
                    actor,
                    pxGeometry,
                    material,
                    shapeFlags
                )
            } else {
                const halfScale = getActualScale(this).multiplyScalar(0.5)
                const pxGeometry = new PhysX.PxBoxGeometry(
                    halfScale.x,
                    halfScale.y,
                    halfScale.z
                )
                // PhysX.destroy(geometry)
                shape = physics.createShape(
                    pxGeometry,
                    material,
                    true,
                    shapeFlags
                )
                actor.attachShape(shape)
            }

            shape.setSimulationFilterData(tmpFilterData)
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
