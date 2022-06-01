import { distance3d } from "@lincode/math"
import { Matrix3, Object3D, PropertyBinding, Vector3 } from "three"
import { clickSet, mouseDownSet, mouseOutSet, mouseMoveSet, mouseOverSet, mouseUpSet } from "./raycast"
import { frustum, matrix4, ray, vector3, vector3_, vector3_1, vector3_half } from "../../utils/reusables"
import { applyMixins, throttle } from "@lincode/utils"
import { OBB } from "three/examples/jsm/math/OBB"
import { scaleDown, scaleUp } from "../../../engine/constants"
import { addBloom, deleteBloom } from "../../../engine/renderLoop/effectComposer/selectiveBloomPass/renderSelectiveBloom"
import worldToClient from "../../utils/worldToClient"
import { Cancellable } from "@lincode/promiselikes"
import { point2Vec, vec2Point } from "../../utils/vec2Point"
import { MouseInteractionPayload } from "../../../interface/IMouse"
import { addSSR, deleteSSR } from "../../../engine/renderLoop/effectComposer/ssrPass"
import { getCamera } from "../../../states/useCamera"
import { addOutline, deleteOutline } from "../../../engine/renderLoop/effectComposer/outlinePass"
import getCenter from "../../utils/getCenter"
import applyMaterialProperties, { applySet } from "./applyMaterialProperties"
import EventLoopItem from "../../../api/core/EventLoopItem"
import IStaticObjectManager from "../../../interface/IStaticObjectManaget"
import AnimationMixin from "../mixins/AnimationMixin"
import MeshItem from "../MeshItem"

const thisOBB = new OBB()
const targetOBB = new OBB()


const updateFrustum = throttle(() => {
    const camera = getCamera()
    frustum.setFromProjectionMatrix(matrix4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse))
}, 200, "leading")



class StaticObjectManager<T extends Object3D = Object3D> extends EventLoopItem implements IStaticObjectManager {
    public constructor(
        public object3d: T
    ) {
        super(object3d)
    }

    public override dispose() {
        super.dispose()
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

    public rayIntersects(target: StaticObjectManager) {
        return !!this.rayIntersectsAt(target)
    }

    public intersects(target: StaticObjectManager) {
        if (this.done) return false
        if (target.done) return false
        if (this === target) return false

        thisOBB.set(this.object3d.getWorldPosition(new Vector3()), vector3_1.clone(), new Matrix3())
        thisOBB.applyMatrix4(this.object3d.matrixWorld)

        targetOBB.set(target.object3d.getWorldPosition(new Vector3()), vector3_1.clone(), new Matrix3())
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

    public get frustumVisible() {
        updateFrustum()
        return frustum.containsPoint(getCenter(this.object3d))
    }

    public lookAt(target: MeshItem | { x: number, y: number, z: number }) {
        if ("outerObject3d" in target)
            this.outerObject3d.lookAt((target.object3d ?? target.outerObject3d).getWorldPosition(vector3))
        else
            this.outerObject3d.lookAt(point2Vec(target))
    }
}
interface StaticObjectManager<T extends Object3D = Object3D> extends EventLoopItem, AnimationMixin {}
applyMixins(StaticObjectManager, [AnimationMixin])
export default StaticObjectManager