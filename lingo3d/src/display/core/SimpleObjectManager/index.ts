import { rad2Deg, deg2Rad, distance3d } from "@lincode/math"
import { Matrix3, Object3D, PropertyBinding, Vector3 } from "three"
import { clickSet, mouseDownSet, mouseOutSet, mouseMoveSet, mouseOverSet, mouseUpSet } from "./raycast"
import { frustum, matrix4, quaternion, ray, vector3, vector3_, vector3_1, vector3_half } from "../../utils/reusables"
import { forceGet, throttle } from "@lincode/utils"
import { OBB } from "three/examples/jsm/math/OBB"
import { scaleDown, scaleUp } from "../../../engine/constants"
import { addBloom, deleteBloom } from "../../../engine/renderLoop/effectComposer/selectiveBloomPass/renderSelectiveBloom"
import worldToClient from "../../utils/worldToClient"
import { Cancellable } from "@lincode/promiselikes"
import Point3d from "../../../api/Point3d"
import { point2Vec, vec2Point } from "../../utils/vec2Point"
import ISimpleObjectManager, { OnIntersectValue } from "../../../interface/ISimpleObjectManager"
import PhysicsItem from "./PhysicsItem"
import { cannonContactBodies, cannonContactMap } from "./PhysicsItem/cannon/cannonLoop"
import { MouseInteractionPayload } from "../../../interface/IMouse"
import { addSSR, deleteSSR } from "../../../engine/renderLoop/effectComposer/ssrPass"
import { getCamera } from "../../../states/useCamera"
import bvhContactMap from "./PhysicsItem/bvh/bvhContactMap"
import { addOutline, deleteOutline } from "../../../engine/renderLoop/effectComposer/outlinePass"
import getCenter from "../../utils/getCenter"
import applyMaterialProperties, { applySet } from "./applyMaterialProperties"
import { Reactive } from "@lincode/reactivity"
import PositionedItem from "../../../api/core/PositionedItem"

export const idMap = new Map<string, Set<SimpleObjectManager>>()
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


const updateFrustum = throttle(() => {
    const camera = getCamera()
    frustum.setFromProjectionMatrix(matrix4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse))
}, 200, "leading")



export default class SimpleObjectManager<T extends Object3D = Object3D> extends PhysicsItem implements ISimpleObjectManager {
    public constructor(
        public object3d: T
    ) {
        super(object3d)
    }

    public override dispose() {
        super.dispose()
        this._id !== undefined && idMap.get(this._id)!.delete(this)
        deleteSSR(this.object3d)
        return this
    }

    protected addToRaycastSet(set: Set<Object3D>, handle: Cancellable) {
        set.add(this.object3d)
        handle.then(() => set.delete(this.object3d))
    }

    protected clickHandle: Cancellable | undefined
    private _onClick?: (e: MouseInteractionPayload) => void
    public get onClick(): ((e: MouseInteractionPayload) => void) | undefined {
        return this._onClick
    }
    public set onClick(cb: ((e: MouseInteractionPayload) => void) | undefined) {
        this.clickHandle?.cancel()

        this._onClick = cb
        if (!cb) return
        
        this.addToRaycastSet(clickSet, this.clickHandle = new Cancellable())
    }

    protected mouseDownHandle: Cancellable | undefined
    private _onMouseDown?: (e: MouseInteractionPayload) => void
    public get onMouseDown(): ((e: MouseInteractionPayload) => void) | undefined {
        return this._onMouseDown
    }
    public set onMouseDown(cb: ((e: MouseInteractionPayload) => void) | undefined) {
        this.mouseDownHandle?.cancel()

        this._onMouseDown = cb
        if (!cb) return
        
        this.addToRaycastSet(mouseDownSet, this.mouseDownHandle = new Cancellable())
    }

    protected mouseUpHandle: Cancellable | undefined
    private _onMouseUp?: (e: MouseInteractionPayload) => void
    public get onMouseUp(): ((e: MouseInteractionPayload) => void) | undefined {
        return this._onMouseUp
    }
    public set onMouseUp(cb: ((e: MouseInteractionPayload) => void) | undefined) {
        this.mouseUpHandle?.cancel()

        this._onMouseUp = cb
        if (!cb) return
        
        this.addToRaycastSet(mouseUpSet, this.mouseUpHandle = new Cancellable())
    }

    protected mouseOverHandle: Cancellable | undefined
    private _onMouseOver?: (e: MouseInteractionPayload) => void
    public get onMouseOver(): ((e: MouseInteractionPayload) => void) | undefined {
        return this._onMouseOver
    }
    public set onMouseOver(cb: ((e: MouseInteractionPayload) => void) | undefined) {
        this.mouseOverHandle?.cancel()

        this._onMouseOver = cb
        if (!cb) return
        
        this.addToRaycastSet(mouseOverSet, this.mouseOverHandle = new Cancellable())
    }

    protected mouseOutHandle: Cancellable | undefined
    private _onMouseOut?: (e: MouseInteractionPayload) => void
    public get onMouseOut(): ((e: MouseInteractionPayload) => void) | undefined {
        return this._onMouseOut
    }
    public set onMouseOut(cb: ((e: MouseInteractionPayload) => void) | undefined) {
        this.mouseOutHandle?.cancel()

        this._onMouseOut = cb
        if (!cb) return
        
        this.addToRaycastSet(mouseOutSet, this.mouseOutHandle = new Cancellable())
    }

    protected mouseMoveHandle: Cancellable | undefined
    private _onMouseMove?: (e: MouseInteractionPayload) => void
    public get onMouseMove(): ((e: MouseInteractionPayload) => void) | undefined {
        return this._onMouseMove
    }
    public set onMouseMove(cb: ((e: MouseInteractionPayload) => void) | undefined) {
        this.mouseMoveHandle?.cancel()

        this._onMouseMove = cb
        if (!cb) return
        
        this.addToRaycastSet(mouseMoveSet, this.mouseMoveHandle = new Cancellable())
    }

    public get name() {
        return this.outerObject3d.name
    }
    public set name(val: string) {
        this.outerObject3d.name = PropertyBinding.sanitizeNodeName(val)
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

    public getRayIntersectionsAt(id: string, maxDistance?: number) {
        const result: Array<[SimpleObjectManager, Point3d]> = []
        for (const target of idMap.get(id) ?? []) {
            if (target === this) continue
            const pt = this.rayIntersectsAt(target, maxDistance)
            pt && result.push([target, pt])
        }
        this.object3d.getWorldPosition(vector3_)
        return result.sort((a, b) => {
            return distance3dCached(a[1], vector3_) - distance3dCached(b[1], vector3_)
        })
    }

    public getRayIntersections(id: string, maxDistance?: number) {
        return this.getRayIntersectionsAt(id, maxDistance).map(result => result[0])
    }

    public listenToRayIntersection(id: string, cb: (target: SimpleObjectManager, pt: Point3d) => void, maxDistance?: number) {
        return this.loop(() => {
            for (const [target, pt] of this.getRayIntersectionsAt(id, maxDistance))
                cb(target, pt)
        })
    }

    public intersects(target: SimpleObjectManager) {
        if (this.done) return false
        if (target.done) return false
        if (this === target) return false

        if ((this.bvhMap && target.bvhCharacter) || (this.bvhCharacter && target.bvhMap))
            return (
                bvhContactMap.get(this)?.has(target) ||
                bvhContactMap.get(target)?.has(this) || false
            )

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

    public getIntersections(id: string) {
        const result: Array<SimpleObjectManager> = []
        for (const target of idMap.get(id) ?? []) {
            if (target === this) continue
            this.intersects(target) && result.push(target)
        }
        return result
    }

    public listenToIntersection(id: string, cb?: OnIntersectValue, cbOut?: OnIntersectValue) {
        let intersectionsOld: Array<SimpleObjectManager> = []

        return this.loop(() => {
            const intersections = this.getIntersections(id)

            if (cb)
                for (const target of intersections)
                    if (!intersectionsOld.includes(target))
                        cb(target)

            if (cbOut)
                for (const target of intersectionsOld)
                    if (!intersections.includes(target))
                        cbOut(target)
                    
            intersectionsOld = intersections
        })
    }

    private onIntersectState?: Reactive<OnIntersectValue | undefined>
    private onIntersectOutState?: Reactive<OnIntersectValue | undefined>
    private intersectIdsState?: Reactive<Array<string> | undefined>

    private initIntersect() {
        if (this.onIntersectState) return

        this.onIntersectState = new Reactive<OnIntersectValue | undefined>(undefined)
        this.onIntersectOutState = new Reactive<OnIntersectValue | undefined>(undefined)
        this.intersectIdsState = new Reactive<Array<string> | undefined>(undefined)

        this.createEffect(() => {
            const { onIntersect, onIntersectOut, intersectIds } = this
            if (!intersectIds || (!onIntersect && !onIntersectOut)) return

            const handles: Array<Cancellable> = []

            for (const id of intersectIds)
                handles.push(this.listenToIntersection(id, onIntersect, onIntersectOut))

            return () => {
                for (const handle of handles)
                    handle.cancel()
            }
        }, [this.onIntersectState.get, this.onIntersectOutState.get, this.intersectIdsState.get])
    }
    
    public get onIntersect() {
        return this.onIntersectState?.get()
    }
    public set onIntersect(val: OnIntersectValue | undefined) {
        this.initIntersect()
        this.onIntersectState?.set(val)
    }

    public get onIntersectOut() {
        return this.onIntersectOutState?.get()
    }
    public set onIntersectOut(val: OnIntersectValue | undefined) {
        this.initIntersect()
        this.onIntersectOutState?.set(val)
    }

    public get intersectIds() {
        return this.intersectIdsState?.get()
    }
    public set intersectIds(val: Array<string> | undefined) {
        this.initIntersect()
        this.intersectIdsState?.set(val)
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
    
    public override get x() {
        return super.x
    }
    public override set x(val: number) {
        super.x = val
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).x = true)
    }

    public override get y() {
        return super.y
    }
    public override set y(val: number) {
        super.y = val
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).y = true)
    }

    public override get z() {
        return super.z
    }
    public override set z(val: number) {
        super.z = val
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

    protected onRotationY?: () => void
    public get rotationY() {
        return this.outerObject3d.rotation.y * rad2Deg
    }
    public set rotationY(val: number) {
        this.outerObject3d.rotation.y = val * deg2Rad
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).y = true)
        this.onRotationY?.()
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

    public get outline() {
        return !!this.object3d.userData.outline
    }
    public set outline(val: boolean) {
        val ? addOutline(this.object3d) : deleteOutline(this.object3d)
    }

    private _visible?: boolean
    public get visible() {
        return this._visible !== false
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
        return this._metalnessFactor ?? 0
    }
    public set metalnessFactor(val: number) {
        this._metalnessFactor = val
        applySet.add(this)
        applyMaterialProperties()
    }
    
    protected _roughnessFactor?: number
    public get roughnessFactor() {
        return this._roughnessFactor ?? 1
    }
    public set roughnessFactor(val: number) {
        this._roughnessFactor = val
        applySet.add(this)
        applyMaterialProperties()
    }

    protected _environmentFactor?: number
    public get environmentFactor() {
        return this._environmentFactor ?? 1
    }
    public set environmentFactor(val: number) {
        this._environmentFactor = val
        applySet.add(this)
        applyMaterialProperties()
    }
    
    protected _toon?: boolean
    public get toon() {
        return this._toon ?? false
    }
    public set toon(val: boolean) {
        this._toon = val
        applySet.add(this)
        applyMaterialProperties()
    }

    protected _pbr?: boolean
    public get pbr() {
        return this._pbr ?? false
    }
    public set pbr(val: boolean) {
        this._pbr = val
        applySet.add(this)
        applyMaterialProperties()
    }

    public lookAt(target: PositionedItem | Point3d) {
        if ("object3d" in target)
            this.outerObject3d.lookAt((target.object3d ?? target.outerObject3d).getWorldPosition(vector3))
        else
            this.outerObject3d.lookAt(point2Vec(target))

        this.physicsRotate()
        this.onRotationY?.()
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

    public placeAt(object: PositionedItem | { x: number, y: number, z: number }) {
        if ("object3d" in object) {
            this.outerObject3d.position.copy(getCenter(object.object3d ?? object.outerObject3d))
            this.outerObject3d.quaternion.copy(object.outerObject3d.getWorldQuaternion(quaternion))
        }
        else this.outerObject3d.position.copy(point2Vec(object))

        this.physicsMove()
        this.physicsRotate()
        this.onRotationY?.()
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

    public get frustumVisible() {
        updateFrustum()
        return frustum.containsPoint(getCenter(this.object3d))
    }
}