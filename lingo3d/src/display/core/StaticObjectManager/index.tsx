import { distance3d, Point3d } from "@lincode/math"
import { Material, Matrix3, MeshStandardMaterial, MeshToonMaterial, Object3D, PropertyBinding } from "three"
import { clickSet, mouseDownSet, mouseOutSet, mouseMoveSet, mouseOverSet, mouseUpSet } from "./raycast"
import { frustum, matrix4, ray, vector3, vector3_, vector3_1, vector3_half, vector3__ } from "../../utils/reusables"
import { applyMixins, forceGet, throttle } from "@lincode/utils"
import { OBB } from "three/examples/jsm/math/OBB"
import { scaleDown, scaleUp } from "../../../engine/constants"
import { addBloom, deleteBloom } from "../../../engine/renderLoop/effectComposer/selectiveBloomPass/renderSelectiveBloom"
import worldToClient from "../../utils/worldToClient"
import { Cancellable } from "@lincode/promiselikes"
import { point2Vec, vec2Point } from "../../utils/vec2Point"
import { LingoMouseEvent } from "../../../interface/IMouse"
import { addSSR, deleteSSR } from "../../../engine/renderLoop/effectComposer/ssrPass"
import { addOutline, deleteOutline } from "../../../engine/renderLoop/effectComposer/outlinePass"
import getCenter from "../../utils/getCenter"
import EventLoopItem from "../../../api/core/EventLoopItem"
import IStaticObjectManager from "../../../interface/IStaticObjectManaget"
import AnimationMixin from "../mixins/AnimationMixin"
import MeshItem, { getObject3d } from "../MeshItem"
import { Reactive } from "@lincode/reactivity"
import copyStandard from "./applyMaterialProperties/copyStandard"
import copyToon from "./applyMaterialProperties/copyToon"
import { getCameraRendered } from "../../../states/useCameraRendered"

const thisOBB = new OBB()
const targetOBB = new OBB()

const updateFrustum = throttle(() => {
    const camera = getCameraRendered()
    frustum.setFromProjectionMatrix(matrix4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse))
}, 200, "leading")

const forcePBRSet = new WeakSet<Material>()

const setNumber = (child: any, property: string, factor: number | undefined) => {
    const defaultValue: number | undefined = child.userData[property] ??= child.material[property]
    child.material[property] = factor === undefined
        ? defaultValue
        : (defaultValue || (forcePBRSet.has(child.material) ? 1 : 0)) * factor
}

const setBoolean = (child: any, property: string, value: boolean | undefined) => {
    const defaultValue: boolean | undefined = child.userData[property] ??= child.material[property]
    child.material[property] = value === undefined ? defaultValue : value
}

export const staticIdMap = new Map<string, Set<StaticObjectManager>>()
const makeSet = () => new Set()

class StaticObjectManager<T extends Object3D = Object3D> extends EventLoopItem implements IStaticObjectManager {
    public constructor(
        public object3d: T
    ) {
        super(object3d)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        deleteSSR(this.object3d)
        this._id !== undefined && staticIdMap.get(this._id)!.delete(this)
        return this
    }

    protected _id?: string
    public get id() {
        return this._id
    }
    public set id(val: string | undefined) {
        this._id !== undefined && staticIdMap.get(this._id)!.delete(this)
        this._id = val
        val !== undefined && forceGet(staticIdMap, val, makeSet).add(this)
    }

    protected addToRaycastSet(set: Set<Object3D>, handle: Cancellable) {
        set.add(this.object3d)
        handle.then(() => set.delete(this.object3d))
    }

    protected clickHandle: Cancellable | undefined
    private _onClick?: (e: LingoMouseEvent) => void
    public get onClick(): ((e: LingoMouseEvent) => void) | undefined {
        return this._onClick
    }
    public set onClick(cb: ((e: LingoMouseEvent) => void) | undefined) {
        this.clickHandle?.cancel()

        this._onClick = cb
        if (!cb) return
        
        this.addToRaycastSet(clickSet, this.clickHandle = new Cancellable())
    }

    protected mouseDownHandle: Cancellable | undefined
    private _onMouseDown?: (e: LingoMouseEvent) => void
    public get onMouseDown(): ((e: LingoMouseEvent) => void) | undefined {
        return this._onMouseDown
    }
    public set onMouseDown(cb: ((e: LingoMouseEvent) => void) | undefined) {
        this.mouseDownHandle?.cancel()

        this._onMouseDown = cb
        if (!cb) return
        
        this.addToRaycastSet(mouseDownSet, this.mouseDownHandle = new Cancellable())
    }

    protected mouseUpHandle: Cancellable | undefined
    private _onMouseUp?: (e: LingoMouseEvent) => void
    public get onMouseUp(): ((e: LingoMouseEvent) => void) | undefined {
        return this._onMouseUp
    }
    public set onMouseUp(cb: ((e: LingoMouseEvent) => void) | undefined) {
        this.mouseUpHandle?.cancel()

        this._onMouseUp = cb
        if (!cb) return
        
        this.addToRaycastSet(mouseUpSet, this.mouseUpHandle = new Cancellable())
    }

    protected mouseOverHandle: Cancellable | undefined
    private _onMouseOver?: (e: LingoMouseEvent) => void
    public get onMouseOver(): ((e: LingoMouseEvent) => void) | undefined {
        return this._onMouseOver
    }
    public set onMouseOver(cb: ((e: LingoMouseEvent) => void) | undefined) {
        this.mouseOverHandle?.cancel()

        this._onMouseOver = cb
        if (!cb) return
        
        this.addToRaycastSet(mouseOverSet, this.mouseOverHandle = new Cancellable())
    }

    protected mouseOutHandle: Cancellable | undefined
    private _onMouseOut?: (e: LingoMouseEvent) => void
    public get onMouseOut(): ((e: LingoMouseEvent) => void) | undefined {
        return this._onMouseOut
    }
    public set onMouseOut(cb: ((e: LingoMouseEvent) => void) | undefined) {
        this.mouseOutHandle?.cancel()

        this._onMouseOut = cb
        if (!cb) return
        
        this.addToRaycastSet(mouseOutSet, this.mouseOutHandle = new Cancellable())
    }

    protected mouseMoveHandle: Cancellable | undefined
    private _onMouseMove?: (e: LingoMouseEvent) => void
    public get onMouseMove(): ((e: LingoMouseEvent) => void) | undefined {
        return this._onMouseMove
    }
    public set onMouseMove(cb: ((e: LingoMouseEvent) => void) | undefined) {
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

    protected getRay() {
        return ray.set(this.object3d.getWorldPosition(vector3_), this.object3d.getWorldDirection(vector3))
    }

    public pointAt(distance: number) {
        return vec2Point(this.getRay().at(distance * scaleDown, vector3))
    }

    public rayIntersectsAt(target: StaticObjectManager, maxDistance?: number) {
        if (this.done) return undefined
        if (target.done) return undefined
        if (this === target) return undefined

        targetOBB.set(
            target.object3d.getWorldPosition(vector3__),
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

    public rayIntersects(target: StaticObjectManager) {
        return !!this.rayIntersectsAt(target)
    }

    public intersects(target: StaticObjectManager) {
        if (this.done) return false
        if (target.done) return false
        if (this === target) return false

        thisOBB.set(this.object3d.getWorldPosition(vector3), vector3_1.clone(), new Matrix3())
        thisOBB.applyMatrix4(this.object3d.matrixWorld)

        targetOBB.set(target.object3d.getWorldPosition(vector3_), vector3_1.clone(), new Matrix3())
        targetOBB.applyMatrix4(target.object3d.matrixWorld)

        return thisOBB.intersectsOBB(targetOBB, 0)
    }

    public get clientX() {
        return worldToClient(this.object3d).x
    }

    public get clientY() {
        return worldToClient(this.object3d).y
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

    public get frustumCulled() {
        return this.outerObject3d.frustumCulled
    }
    public set frustumCulled(val: boolean) {
        this.outerObject3d.traverse(child => child.frustumCulled = val)
    }

    private _refreshFactors?: Reactive<{}>
    protected refreshFactors() {
        if (this._refreshFactors) {
            this._refreshFactors.set({})
            return
        }
        this._refreshFactors = new Reactive({})

        this.createEffect(() => {
            const handle = new Cancellable()

            const { _toon, _pbr, _metalnessFactor, _roughnessFactor, _opacityFactor } = this

            this.outerObject3d.traverse((child: any) => {
                let { material } = child
                if (!material) return
            
                Array.isArray(material) && (material = material[0])
            
                if (_toon) {
                    child.material = new MeshToonMaterial()
                    copyToon(material, child.material)
                }
                else if (_pbr) {
                    forcePBRSet.add(child.material = new MeshStandardMaterial())
                    copyStandard(material, child.material)
                }
                
                if (_metalnessFactor !== undefined && _metalnessFactor !== 0)
                    setNumber(child, "metalness", _metalnessFactor)

                if (_roughnessFactor !== undefined && _roughnessFactor !== 1)
                    setNumber(child, "roughness", _roughnessFactor)

                if (_opacityFactor !== undefined && _opacityFactor !== 1) {
                    setNumber(child, "opacity", _opacityFactor)
                    setBoolean(child, "transparent", _opacityFactor < 1)
                }

                handle.then(() => {
                    if (child.material === material) {
                        setNumber(child, "metalness", undefined)
                        setNumber(child, "roughness", undefined)
                        setNumber(child, "opacity", undefined)
                        setBoolean(child, "transparent", undefined)
                        return
                    }
                    child.material.dispose()
                    child.material = material
                })
            })
            return () => {
                handle.cancel()
            }
        }, [this._refreshFactors.get])
    }

    private _metalnessFactor?: number
    public get metalnessFactor() {
        return this._metalnessFactor ?? 0
    }
    public set metalnessFactor(val) {
        this._metalnessFactor = val
        this.refreshFactors()
    }
    
    private _roughnessFactor?: number
    public get roughnessFactor() {
        return this._roughnessFactor ?? 1
    }
    public set roughnessFactor(val) {
        this._roughnessFactor = val
        this.refreshFactors()
    }

    private _opacityFactor?: number
    public get opacityFactor() {
        return this._opacityFactor ?? 1
    }
    public set opacityFactor(val) {
        this._opacityFactor = val
        this.refreshFactors()
    }
    
    private _toon?: boolean
    public get toon() {
        return this._toon ?? false
    }
    public set toon(val) {
        this._toon = val
        this.refreshFactors()
    }

    private _pbr?: boolean
    public get pbr() {
        return this._pbr ?? false
    }
    public set pbr(val) {
        this._pbr = val
        this.refreshFactors()
    }

    public get frustumVisible() {
        updateFrustum()
        return frustum.containsPoint(getCenter(this.object3d))
    }

    public lookAt(target: MeshItem | Point3d) {
        if ("outerObject3d" in target)
            this.outerObject3d.lookAt(getObject3d(target).getWorldPosition(vector3))
        else
            this.outerObject3d.lookAt(point2Vec(target))
    }
}
interface StaticObjectManager<T extends Object3D = Object3D> extends EventLoopItem, AnimationMixin {}
applyMixins(StaticObjectManager, [AnimationMixin])
export default StaticObjectManager