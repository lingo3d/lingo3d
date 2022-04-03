import { rad2Deg, deg2Rad, distance3d } from "@lincode/math"
import { Matrix3, MeshStandardMaterial, MeshToonMaterial, Object3D, Vector3 } from "three"
import { clickSet, mouseDownSet, mouseOutSet, mouseMoveSet, mouseOverSet, mouseUpSet } from "./raycast"
import { quaternion, ray, vector3, vector3_, vector3_1, vector3_half } from "../../utils/reusables"
import { debounce, forceGet } from "@lincode/utils"
import { OBB } from "three/examples/jsm/math/OBB"
import { scaleDown, scaleUp } from "../../../engine/constants"
import { addBloom, deleteBloom } from "../../../engine/render/effectComposer/selectiveBloomPass/renderSelectiveBloom"
import worldToClient from "../../utils/worldToClient"
import { Cancellable } from "@lincode/promiselikes"
import Point3d from "../../../api/Point3d"
import { point2Vec, vec2Point } from "../../utils/vec2Point"
import ISimpleObjectManager from "../../../interface/ISimpleObjectManager"
import PhysicsItem from "./PhysicsItem"
import { cannonContactBodies, cannonContactMap } from "./PhysicsItem/cannon/cannonLoop"
import { MouseInteractionPayload } from "../../../interface/IMouse"
import { addSSR, deleteSSR } from "../../../engine/render/effectComposer/ssrPass"
import Loaded from "../Loaded"
import { Group } from "../../.."

const idMap = new Map<string, Set<SimpleObjectManager>>()
const thisOBB = new OBB()
const targetOBB = new OBB()

const makeSet = () => new Set()

const ptDistCache = new WeakMap<Point3d, number>()
const distance3dCached = (pt: Point3d, vecSelf: Vector3) => {
    const cached = ptDistCache.get(pt)
    if (cached) return cached

    const result = distance3d(pt.x, pt.y, pt.z, vecSelf.x * scaleUp, vecSelf.y * scaleUp, vecSelf.z * scaleUp)
    ptDistCache.set(pt, result)
    return result
}



const modelSet = new Set<SimpleObjectManager | Loaded<Group>>()

const getDefault = (child: any, property: string) => (
    child.userData[property] ??= (child.material[property] ?? 0)
)
const setValue = (child: any, property: string, factor: number) => {
    child.material[property] = getDefault(child, property) * factor
}

const processChild = (child: any, _toon?: boolean, _metalnessFactor?: number, _roughnessFactor?: number) => {
    const { material } = child
    if (!material) return

    if (_toon) {
        if (!(material instanceof MeshToonMaterial)) {
            child.material = new MeshToonMaterial()
            child.material.copy(material)
            material.dispose()
        }
        // (child.material as MeshToonMaterial).gradientMap = new 
    }
    else if (material instanceof MeshStandardMaterial) {
        _metalnessFactor !== undefined && setValue(child, "metalness", _metalnessFactor)
        _roughnessFactor !== undefined && setValue(child, "roughness", _roughnessFactor)
    }
}

const applyProperties = debounce(() => {
    for (const model of modelSet) {
        //@ts-ignore
        const { _toon, _metalnessFactor, _roughnessFactor } = model

        if ("loadedResolvable" in model)
            //@ts-ignore
            model.loadedResolvable.then(loaded => {
                loaded.traverse(child => processChild(child, _toon, _metalnessFactor, _roughnessFactor))
            })
        else
            model.outerObject3d.traverse(child => processChild(child, _toon, _metalnessFactor, _roughnessFactor))
    }
    modelSet.clear()    

}, 0, "trailing")






export default class SimpleObjectManager<T extends Object3D = Object3D> extends PhysicsItem implements ISimpleObjectManager {
    public outerObject3d: Object3D

    public constructor(
        public object3d: T
    ) {
        super()
        this.outerObject3d = object3d
        this.initOuterObject3d()
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()

        this._id !== undefined && idMap.get(this._id)!.delete(this)
        deleteSSR(this.object3d)

        return this
    }

    public find<T extends SimpleObjectManager>(name: string): T | undefined {
        const child = this.outerObject3d.getObjectByName(name)
        return child && (child.userData.manager ??= new SimpleObjectManager(child))
    }

    public findAll<T extends SimpleObjectManager>(name: string): Array<T> {
        const result: Array<T> = []

        this.outerObject3d.traverse(child => {
            child.name === name && result.push(child.userData.manager ??= new SimpleObjectManager(child))
        })
        return result
    }

    private clickHandle: Cancellable | undefined
    private _onClick?: (e: MouseInteractionPayload) => void
    public get onClick(): ((e: MouseInteractionPayload) => void) | undefined {
        return this._onClick
    }
    public set onClick(cb: ((e: MouseInteractionPayload) => void) | undefined) {
        this.clickHandle?.cancel()

        this._onClick = cb
        if (!cb) return
        
        clickSet.add(this.object3d)
        this.clickHandle = this.cancellable(() => clickSet.delete(this.object3d))
    }

    private mouseDownHandle: Cancellable | undefined
    private _onMouseDown?: (e: MouseInteractionPayload) => void
    public get onMouseDown(): ((e: MouseInteractionPayload) => void) | undefined {
        return this._onMouseDown
    }
    public set onMouseDown(cb: ((e: MouseInteractionPayload) => void) | undefined) {
        this.mouseDownHandle?.cancel()

        this._onMouseDown = cb
        if (!cb) return
        
        mouseDownSet.add(this.object3d)
        this.mouseDownHandle = this.cancellable(() => mouseDownSet.delete(this.object3d))
    }

    private mouseUpHandle: Cancellable | undefined
    private _onMouseUp?: (e: MouseInteractionPayload) => void
    public get onMouseUp(): ((e: MouseInteractionPayload) => void) | undefined {
        return this._onMouseUp
    }
    public set onMouseUp(cb: ((e: MouseInteractionPayload) => void) | undefined) {
        this.mouseUpHandle?.cancel()

        this._onMouseUp = cb
        if (!cb) return
        
        mouseUpSet.add(this.object3d)
        this.mouseUpHandle = this.cancellable(() => mouseUpSet.delete(this.object3d))
    }

    private mouseOverHandle: Cancellable | undefined
    private _onMouseOver?: (e: MouseInteractionPayload) => void
    public get onMouseOver(): ((e: MouseInteractionPayload) => void) | undefined {
        return this._onMouseOver
    }
    public set onMouseOver(cb: ((e: MouseInteractionPayload) => void) | undefined) {
        this.mouseOverHandle?.cancel()

        this._onMouseOver = cb
        if (!cb) return
        
        mouseOverSet.add(this.object3d)
        this.mouseOverHandle = this.cancellable(() => mouseOverSet.delete(this.object3d))
    }

    private mouseOutHandle: Cancellable | undefined
    private _onMouseOut?: (e: MouseInteractionPayload) => void
    public get onMouseOut(): ((e: MouseInteractionPayload) => void) | undefined {
        return this._onMouseOut
    }
    public set onMouseOut(cb: ((e: MouseInteractionPayload) => void) | undefined) {
        this.mouseOutHandle?.cancel()

        this._onMouseOut = cb
        if (!cb) return
        
        mouseOutSet.add(this.object3d)
        this.mouseOutHandle = this.cancellable(() => mouseOutSet.delete(this.object3d))
    }

    private mouseMoveHandle: Cancellable | undefined
    private _onMouseMove?: (e: MouseInteractionPayload) => void
    public get onMouseMove(): ((e: MouseInteractionPayload) => void) | undefined {
        return this._onMouseMove
    }
    public set onMouseMove(cb: ((e: MouseInteractionPayload) => void) | undefined) {
        this.mouseMoveHandle?.cancel()

        this._onMouseMove = cb
        if (!cb) return
        
        mouseMoveSet.add(this.object3d)
        this.mouseMoveHandle = this.cancellable(() => mouseOutSet.delete(this.object3d))
    }

    public get name() {
        return this.outerObject3d.name
    }
    public set name(val: string) {
        this.outerObject3d.name = val
    }

    private _id?: string
    public get id() {
        return this._id
    }
    public set id(val: string | undefined) {
        this._id !== undefined && idMap.get(this._id)!.delete(this)
        this._id = val
        val !== undefined && forceGet(idMap, val, makeSet).add(this)
    }

    public getWorldPosition() {
        return vec2Point(this.object3d.getWorldPosition(vector3_))
    }

    protected getRay() {
        return ray.set(this.object3d.getWorldPosition(vector3_), this.object3d.getWorldDirection(vector3))
    }

    public pointAt(distance: number) {
        return vec2Point(this.getRay().at(distance * scaleDown, vector3))
    }

    public rayIntersectsAt(target: SimpleObjectManager, maxDistance?: number) {
        if (this.done) return undefined
        if (target.done) return undefined
        if (this === target) return undefined

        targetOBB.set(
            target.object3d.getWorldPosition(new Vector3()),
            vector3_half,
            new Matrix3().setFromMatrix4(target.object3d.matrixWorld)
        )
        
        const vec = targetOBB.intersectRay(this.getRay(), vector3)
        if (!vec) return
        
        if (maxDistance) {
            const { x, y, z } = this.object3d.getWorldPosition(vector3_)
            if (distance3d(vec.x, vec.y, vec.z, x, y, z) * scaleUp > maxDistance)
                return
        }
        return vec2Point(vec)
    }

    public rayIntersects(target: SimpleObjectManager) {
        return !!this.rayIntersectsAt(target)
    }

    public getRayIntersectionsAt<T extends SimpleObjectManager>(id: string, maxDistance?: number) {
        const result: Array<[T, Point3d]> = []
        for (const target of idMap.get(id) ?? []) {
            if (target === this) continue
            const pt = this.rayIntersectsAt(target, maxDistance)
            pt && result.push([target as T, pt])
        }
        this.object3d.getWorldPosition(vector3_)
        return result.sort((a, b) => {
            return distance3dCached(a[1], vector3_) - distance3dCached(b[1], vector3_)
        })
    }

    public getRayIntersections<T extends SimpleObjectManager>(id: string, maxDistance?: number): Array<T> {
        return this.getRayIntersectionsAt(id, maxDistance).map<T>(result => result[0] as T)
    }

    public listenToRayIntersection<T extends SimpleObjectManager>(
        id: string, cb: (target: T, pt: Point3d) => void, maxDistance?: number
    ) {
        return this.loop(() => {
            for (const [target, pt] of this.getRayIntersectionsAt<T>(id, maxDistance))
                cb(target, pt)
        })
    }

    public intersects(target: SimpleObjectManager) {
        if (this.done) return false
        if (target.done) return false
        if (this === target) return false

        if (this.cannonBody && target.cannonBody) {
            cannonContactBodies.add(this.cannonBody)
            cannonContactBodies.add(target.cannonBody)
            return (
                cannonContactMap.get(this.cannonBody)?.has(target.cannonBody) ||
                cannonContactMap.get(target.cannonBody)?.has(this.cannonBody) || false
            )
        }

        thisOBB.set(this.object3d.getWorldPosition(new Vector3()), vector3_1.clone(), new Matrix3())
        thisOBB.applyMatrix4(this.object3d.matrixWorld)

        targetOBB.set(target.object3d.getWorldPosition(new Vector3()), vector3_1.clone(), new Matrix3())
        targetOBB.applyMatrix4(target.object3d.matrixWorld)

        return thisOBB.intersectsOBB(targetOBB, 0)
    }

    public getIntersections<T extends SimpleObjectManager>(id: string) {
        const result: Array<T> = []
        for (const target of idMap.get(id) ?? []) {
            if (target === this) continue
            this.intersects(target) && result.push(target as T)
        }
        return result
    }

    public listenToIntersection<T extends SimpleObjectManager>(id: string, cb: (target: T) => void) {
        return this.loop(() => {
            for (const target of this.getIntersections<T>(id))
                cb(target)
        })
    }

    public intersectIDs?: string[] | undefined;

    private _onIntersect?: (target: SimpleObjectManager) => void
    private _onIntersectHandles?: Array<Cancellable>
    public get onIntersect() {
        return this._onIntersect
    }
    public set onIntersect(cb: ((target: SimpleObjectManager) => void) | undefined) {
        this._onIntersect = cb

        if (this._onIntersectHandles)
            for (const handle of this._onIntersectHandles)
                handle.cancel()

        if (!cb || !this.intersectIDs) return

        const handles: Array<Cancellable> = this._onIntersectHandles = []
        for (const id of this.intersectIDs)
            handles.push(this.listenToIntersection(id, cb))
    }

    public get clientX() {
        return worldToClient(this.object3d).x
    }

    public get clientY() {
        return worldToClient(this.object3d).y
    }

    public get width() {
        return this.object3d.scale.x * scaleUp
    }
    public set width(val: number) {
        this.object3d.scale.x = val * scaleDown
    }

    public get height() {
        return this.object3d.scale.y * scaleUp
    }
    public set height(val: number) {
        this.object3d.scale.y = val * scaleDown
    }

    public get depth() {
        return this.object3d.scale.z * scaleUp
    }
    public set depth(val: number) {
        this.object3d.scale.z = val * scaleDown
    }
    
    public get x() {
        return this.outerObject3d.position.x * scaleUp
    }
    public set x(val: number) {
        this.outerObject3d.position.x = val * scaleDown
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).x = true)
    }

    public get y() {
        return this.outerObject3d.position.y * scaleUp
    }
    public set y(val: number) {
        this.outerObject3d.position.y = val * scaleDown
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).y = true)
    }

    public get z() {
        return this.outerObject3d.position.z * scaleUp
    }
    public set z(val: number) {
        this.outerObject3d.position.z = val * scaleDown
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).z = true)
    }

    public get scaleX() {
        return this.outerObject3d.scale.x
    }
    public set scaleX(val: number) {
        this.outerObject3d.scale.x = val
    }

    public get scaleY() {
        return this.outerObject3d.scale.y
    }
    public set scaleY(val: number) {
        this.outerObject3d.scale.y = val
    }

    public get scaleZ() {
        return this.outerObject3d.scale.z
    }
    public set scaleZ(val: number) {
        this.outerObject3d.scale.z = val
    }

    public get scale() {
        return this.scaleX
    }
    public set scale(val: number) {
        this.scaleX = val
        this.scaleY = val
        this.scaleZ = val
    }

    public get rotationX() {
        return this.outerObject3d.rotation.x * rad2Deg
    }
    public set rotationX(val: number) {
        this.outerObject3d.rotation.x = val * deg2Rad
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).x = true)
    }

    public get rotationY() {
        return this.outerObject3d.rotation.y * rad2Deg
    }
    public set rotationY(val: number) {
        this.outerObject3d.rotation.y = val * deg2Rad
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).y = true)
    }

    public get rotationZ() {
        return this.outerObject3d.rotation.z * rad2Deg
    }
    public set rotationZ(val: number) {
        this.outerObject3d.rotation.z = val * deg2Rad
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).z = true)
    }

    public get rotation() {
        return this.rotationZ
    }
    public set rotation(val: number) {
        this.rotationZ = val
    }

    public get reflection() {
        return !!this.object3d.userData.ssr
    }
    public set reflection(val: boolean) {
        val ? addSSR(this.object3d) : deleteSSR(this.object3d)
    }

    public get bloom() {
        return !!this.outerObject3d.userData.bloom
    }
    public set bloom(val: boolean) {
        val ? addBloom(this.outerObject3d) : deleteBloom(this.outerObject3d)
    }

    private _visible?: boolean
    public get visible() {
        return !!this._visible
    }
    public set visible(val: boolean) {
        this._visible = val
        this.outerObject3d.visible = val
    }

    public get innerVisible() {
        return this.object3d.visible
    }
    public set innerVisible(val: boolean) {
        this.object3d.visible = val
    }

    public get frustumCulled() {
        return this.outerObject3d.frustumCulled
    }
    public set frustumCulled(val: boolean) {
        this.outerObject3d.traverse(child => child.frustumCulled = val)
    }

    protected _metalnessFactor?: number
    public get metalnessFactor() {
        return this._metalnessFactor ?? 1
    }
    public set metalnessFactor(val: number) {
        this._metalnessFactor = val
        modelSet.add(this)
        applyProperties()
    }
    
    protected _roughnessFactor?: number
    public get roughnessFactor() {
        return this._roughnessFactor ?? 1
    }
    public set roughnessFactor(val: number) {
        this._roughnessFactor = val
        modelSet.add(this)
        applyProperties()
    }
    
    protected _toon?: boolean
    public get toon() {
        return this._toon ?? false
    }
    public set toon(val: boolean) {
        this._toon = val
        modelSet.add(this)
        applyProperties()
    }

    public lookAt(target: SimpleObjectManager | Point3d) {
        if ("object3d" in target)
            this.outerObject3d.lookAt(target.object3d.getWorldPosition(vector3))
        else
            this.outerObject3d.lookAt(point2Vec(target))

        this.physicsRotate()
    }

    public translateX(val: number) {
        this.outerObject3d.translateX(val * scaleDown)
        this.physicsMove()
    }

    public translateY(val: number) {
        this.outerObject3d.translateY(val * scaleDown)
        this.physicsMove()
    }

    public translateZ(val: number) {
        this.outerObject3d.translateZ(val * scaleDown)
        this.physicsMove()
    }

    public rotateX(val: number) {
        this.outerObject3d.rotateX(val * deg2Rad)

        this.physicsRotate()
    }

    public rotateY(val: number) {
        this.outerObject3d.rotateY(val * deg2Rad)

        this.physicsRotate()
    }

    public rotateZ(val: number) {
        this.outerObject3d.rotateZ(val * deg2Rad)
        this.physicsRotate()
    }

    public placeAt(object: SimpleObjectManager | Point3d) {
        if ("object3d" in object) {
            this.outerObject3d.position.copy(object.object3d.getWorldPosition(vector3))
            this.outerObject3d.quaternion.copy(object.outerObject3d.getWorldQuaternion(quaternion))
        }
        else this.outerObject3d.position.copy(point2Vec(object))

        this.physicsMove()
        this.physicsRotate()
    }

    public moveForward(distance: number) {
        if (distance === 0) return

		vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
		vector3.crossVectors(this.outerObject3d.up, vector3)
		this.outerObject3d.position.addScaledVector(vector3, distance * scaleDown)

        this.physicsMoveXZ()
	}

    public moveRight(distance: number) {
        if (distance === 0) return

		vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
		this.outerObject3d.position.addScaledVector(vector3, distance * scaleDown)

        this.physicsMoveXZ()
	}
}