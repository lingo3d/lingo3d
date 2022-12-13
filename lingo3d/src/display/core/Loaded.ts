import { BufferGeometry, Group, Mesh, Object3D } from "three"
import { boxGeometry } from "../primitives/Cube"
import { wireframeMaterial } from "../utils/reusables"
import ILoaded from "../../interface/ILoaded"
import Reresolvable from "./utils/Reresolvable"
import toResolvable from "../utils/toResolvable"
import MeshItem from "./MeshItem"
import { Point3d } from "@lincode/math"
import {
    addOutline,
    deleteOutline
} from "../../engine/renderLoop/effectComposer/outlineEffect"
import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../../engine/renderLoop/effectComposer/selectiveBloomEffect"
import VisibleObjectManager from "./VisibleObjectManager"
import { setManager } from "../../api/utils/manager"
import { PhysicsOptions } from "../../interface/IPhysicsObjectManager"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
import { getPhysX } from "../../states/usePhysX"

const pxGeometryCache = new Map<string | undefined, any>()
const mergedGeometryCache = new Map<string | undefined, BufferGeometry>()

const getMergedGeometry = (src: string | undefined, loaded: Object3D) => {
    if (mergedGeometryCache.has(src)) return mergedGeometryCache.get(src)!

    const geometries: Array<BufferGeometry> = []
    loaded.traverse(
        (c: Object3D | Mesh) => "geometry" in c && geometries.push(c.geometry)
    )
    const geometry = BufferGeometryUtils.mergeBufferGeometries(geometries)

    const { x, y, z } = loaded.scale
    geometry.scale(x, y, z)
    geometry.dispose()

    mergedGeometryCache.set(src, geometry)
    return geometry
}

const getConvexGeometry = (src: string | undefined, loaded: Object3D) => {
    if (pxGeometryCache.has(src)) return pxGeometryCache.get(src)

    const {
        convexFlags,
        cooking,
        insertionCallback,
        Vector_PxVec3,
        PxConvexMeshDesc,
        PxConvexMeshGeometry
    } = getPhysX()

    const geometry = getMergedGeometry(src, loaded)
    const buffer = geometry.attributes.position
    const vertices = buffer.array

    const vec3Vector = new Vector_PxVec3(buffer.count)
    for (let i = 0; i < buffer.count; i++) {
        const pxVec3 = vec3Vector.at(i)
        const offset = i * 3
        pxVec3.set_x(vertices[offset])
        pxVec3.set_y(vertices[offset + 1])
        pxVec3.set_z(vertices[offset + 2])
    }
    // vec3Vector.destroy()

    const desc = new PxConvexMeshDesc()
    desc.flags = convexFlags
    desc.points.count = buffer.count
    desc.points.stride = 12
    desc.points.data = vec3Vector.data()

    const convexMesh = cooking.createConvexMesh(desc, insertionCallback)
    const pxGeometry = new PxConvexMeshGeometry(convexMesh)

    pxGeometryCache.set(src, pxGeometry)
    return pxGeometry
}

export default abstract class Loaded<T = Object3D>
    extends VisibleObjectManager<Mesh>
    implements ILoaded
{
    public loadedGroup = new Group()

    public constructor(unmounted?: boolean) {
        super(new Mesh(boxGeometry, wireframeMaterial), unmounted)
        this.outerObject3d.add(this.loadedGroup)
    }

    protected loaded = new Reresolvable<Object3D>()

    protected abstract load(src: string): Promise<T>

    protected abstract resolveLoaded(data: T, src: string): Group

    protected _src?: string
    public get src() {
        return this._src
    }
    public set src(val) {
        this._src = val
        this.loaded.done && this.loadedGroup.clear()

        this.cancelHandle(
            "src",
            val &&
                (() =>
                    toResolvable(this.load(val)).then((loaded) => {
                        const loadedObject3d = this.resolveLoaded(loaded, val)
                        this.loadedGroup.add(loadedObject3d)
                        this.loaded.resolve(loadedObject3d)

                        this.object3d.visible = !!this._boxVisible
                    }))
        )
    }

    private _onLoad?: () => void
    public get onLoad() {
        return this._onLoad
    }
    public set onLoad(cb) {
        this._onLoad = cb
        this.cancelHandle(
            "onLoad",
            cb && (() => this.loaded.then(() => void cb()))
        )
    }

    protected widthSet?: boolean
    public override get width() {
        return super.width
    }
    public override set width(val) {
        super.width = val
        this.widthSet = true
    }

    protected heightSet?: boolean
    public override get height() {
        return super.height
    }
    public override set height(val) {
        super.height = val
        this.heightSet = true
    }

    protected depthSet?: boolean
    public override get depth() {
        return super.depth
    }
    public override set depth(val) {
        super.depth = val
        this.depthSet = true
    }

    public override get innerRotationX() {
        return super.innerRotationX
    }
    public override set innerRotationX(val) {
        super.innerRotationX = val
        this.loadedGroup.rotation.x = this.object3d.rotation.x
    }

    public override get innerRotationY() {
        return super.innerRotationY
    }
    public override set innerRotationY(val) {
        super.innerRotationY = val
        this.loadedGroup.rotation.y = this.object3d.rotation.y
    }

    public override get innerRotationZ() {
        return super.innerRotationZ
    }
    public override set innerRotationZ(val) {
        super.innerRotationZ = val
        this.loadedGroup.rotation.z = this.object3d.rotation.z
    }

    public override get innerX() {
        return super.innerX
    }
    public override set innerX(val) {
        super.innerX = val
        this.loadedGroup.position.x = this.object3d.position.x
    }

    public override get innerY() {
        return super.innerY
    }
    public override set innerY(val) {
        super.innerY = val
        this.loadedGroup.position.y = this.object3d.position.y
    }

    public override get innerZ() {
        return super.innerZ
    }
    public override set innerZ(val) {
        super.innerZ = val
        this.loadedGroup.position.z = this.object3d.position.z
    }

    public override get innerVisible() {
        return this.loadedGroup.visible
    }
    public override set innerVisible(val) {
        this.loadedGroup.visible = val
    }

    public override get frustumCulled() {
        return super.frustumCulled
    }
    public override set frustumCulled(val) {
        this.outerObject3d.frustumCulled = val
        this.cancelHandle("frustumCulled", () =>
            this.loaded.then(() => {
                super.frustumCulled = val
            })
        )
    }

    public override get castShadow() {
        return super.castShadow
    }
    public override set castShadow(val) {
        this._castShadow = val
        this.cancelHandle("castShadow", () =>
            this.loaded.then(() => {
                super.castShadow = val
            })
        )
    }

    public override get receiveShadow() {
        return super.receiveShadow
    }
    public override set receiveShadow(val) {
        this._receiveShadow = val
        this.cancelHandle("receiveShadow", () =>
            this.loaded.then(() => {
                super.receiveShadow = val
            })
        )
    }

    protected _boxVisible?: boolean
    public get boxVisible() {
        return this._boxVisible ?? this.object3d.visible
    }
    public set boxVisible(val) {
        this._boxVisible = val
        this.object3d.visible = val
    }

    public override get outline() {
        return super.outline
    }
    public override set outline(val) {
        this._outline = val

        this.cancelHandle("outline", () =>
            this.loaded.then((loaded) => {
                if (!val) return

                addOutline(loaded)
                return () => {
                    deleteOutline(loaded)
                }
            })
        )
    }

    public override get bloom() {
        return super.bloom
    }
    public override set bloom(val) {
        this._bloom = val

        this.cancelHandle("bloom", () =>
            this.loaded.then((loaded) => {
                if (!val) return

                addSelectiveBloom(loaded)
                return () => {
                    deleteSelectiveBloom(loaded)
                }
            })
        )
    }

    private managerSet?: boolean
    protected override addToRaycastSet(set: Set<Object3D>) {
        const { get: getPhysics } = this.physicsState

        const handle = this.createEffect(() => {
            const physics = getPhysics()
            if (physics === "map") {
                const handle0 = this.loaded.then((loaded) => {
                    if (!this.managerSet) {
                        this.managerSet = true
                        loaded.traverse((child) => setManager(child, this))
                    }
                    set.add(loaded)
                    return () => {
                        set.delete(loaded)
                    }
                })
                return () => {
                    handle0.cancel()
                }
            }
            const handle0 = super.addToRaycastSet(set)
            return () => {
                handle0.cancel()
            }
        }, [getPhysics])

        return handle
    }

    public override placeAt(object: MeshItem | Point3d | string) {
        this.cancelHandle("placeAt", () =>
            this.loaded.then(() => void super.placeAt(object))
        )
    }

    protected override refreshPhysics(val: PhysicsOptions) {
        this.cancelHandle("refreshPhysics", () =>
            this.loaded.then(() => void super.refreshPhysics(val))
        )
    }

    protected override getPxShape(mode: PhysicsOptions, actor: any) {
        if (mode === "convex") {
            const { material, shapeFlags, PxRigidActorExt } = getPhysX()

            const pxGeometry = getConvexGeometry(
                this._src,
                this.loadedGroup.children[0]
            )
            return PxRigidActorExt.prototype.createExclusiveShape(
                actor,
                pxGeometry,
                material,
                shapeFlags
            )
        }
        return super.getPxShape(mode, actor)
    }
}

export const getLoadedObject = (item: Loaded | MeshItem) => {
    if ("loadedGroup" in item) return item.loadedGroup
    if ("object3d" in item) return item.object3d
    return item.outerObject3d
}
