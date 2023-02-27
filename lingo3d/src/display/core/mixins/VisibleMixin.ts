import { Cancellable } from "@lincode/promiselikes"
import { forceGetInstance } from "@lincode/utils"
import { Frustum, Matrix3, Object3D } from "three"
import { OBB } from "three/examples/jsm/math/OBB"
import MeshAppendable from "../../../api/core/MeshAppendable"
import {
    addOutline,
    deleteOutline
} from "../../../engine/renderLoop/effectComposer/outlineEffect"
import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../../../engine/renderLoop/effectComposer/selectiveBloomEffect"
import { LingoMouseEvent } from "../../../interface/IMouse"
import IVisible, { HitEvent } from "../../../interface/IVisible"
import Nullable from "../../../interface/utils/Nullable"
import { getCameraRendered } from "../../../states/useCameraRendered"
import renderSystem from "../../../utils/renderSystem"
import throttleFrameLeading from "../../../utils/throttleFrameLeading"
import getCenter from "../../utils/getCenter"
import getWorldPosition from "../../utils/getWorldPosition"
import { matrix4, vector3_1 } from "../../utils/reusables"
import {
    clickSet,
    mouseDownSet,
    mouseUpSet,
    mouseOverSet,
    mouseOutSet,
    mouseMoveSet
} from "../utils/raycast/sets"
import "../utils/raycast"
import { getAppendables } from "../../../api/core/Appendable"
import { reflectionVisibleSet } from "../../../states/useReflectionPairs"

const frustum = new Frustum()
const updateFrustum = throttleFrameLeading(() => {
    const camera = getCameraRendered()
    frustum.setFromProjectionMatrix(
        matrix4.multiplyMatrices(
            camera.projectionMatrix,
            camera.matrixWorldInverse
        )
    )
})

const thisOBB = new OBB()
const targetOBB = new OBB()

const hitCache = new WeakMap<VisibleMixin, WeakSet<VisibleMixin>>()
const [addHitTestSystem, deleteHitTestSystem] = renderSystem(
    (manager: VisibleMixin) => {
        for (const target of getAppendables(manager.hitTarget!)) {
            if (!("object3d" in target!)) return
            const cache = forceGetInstance(hitCache, manager, WeakSet)
            if (manager.hitTest(target)) {
                if (!cache.has(target)) {
                    cache.add(target)
                    manager.onHitStart?.(new HitEvent(target))
                }
                manager.onHit?.(new HitEvent(target))
                continue
            }
            if (!cache.has(target)) continue
            cache.delete(target)
            manager.onHitEnd?.(new HitEvent(target))
        }
    }
)

export default abstract class VisibleMixin<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IVisible
{
    protected _bloom?: boolean
    public get bloom() {
        return !!this._bloom
    }
    public set bloom(val) {
        this._bloom = val
        val
            ? addSelectiveBloom(this.object3d)
            : deleteSelectiveBloom(this.object3d)
    }

    protected _outline?: boolean
    public get outline() {
        return !!this._outline
    }
    public set outline(val) {
        this._outline = val
        val ? addOutline(this.object3d) : deleteOutline(this.object3d)
    }

    private _visible?: boolean
    public get visible() {
        return this._visible
    }
    public set visible(val) {
        this._visible = val
        this.outerObject3d.visible = !!val
    }

    private _reflectionVisible?: boolean
    public get reflectionVisible() {
        return this._reflectionVisible
    }
    public set reflectionVisible(val) {
        this._reflectionVisible = val
        this.cancelHandle(
            "reflectionVisible",
            val &&
                (() => {
                    reflectionVisibleSet.add(this)
                    return new Cancellable(() => {
                        reflectionVisibleSet.delete(this)
                        this.outerObject3d.visible = !!this._visible
                    })
                })
        )
    }

    public get frustumCulled() {
        return this.outerObject3d.frustumCulled
    }
    public set frustumCulled(val) {
        this.outerObject3d.frustumCulled = val
        this.outerObject3d.traverse((child) => (child.frustumCulled = val))
    }

    public get frustumVisible() {
        updateFrustum()
        return frustum.containsPoint(getCenter(this.object3d))
    }

    protected _castShadow?: boolean
    public get castShadow() {
        return this._castShadow
    }
    public set castShadow(val) {
        this._castShadow = val
        const bool = !!val
        this.outerObject3d.traverse((child) => (child.castShadow = bool))
    }

    protected _receiveShadow?: boolean
    public get receiveShadow() {
        return this._receiveShadow
    }
    public set receiveShadow(val) {
        this._receiveShadow = val
        const bool = !!val
        this.outerObject3d.traverse((child) => (child.receiveShadow = bool))
    }

    public addToRaycastSet(set: Set<Object3D>) {
        set.add(this.object3d)
        return new Cancellable(() => set.delete(this.object3d))
    }

    private _onClick?: (e: LingoMouseEvent) => void
    public get onClick() {
        return this._onClick
    }
    public set onClick(cb) {
        this._onClick = cb
        this.cancelHandle(
            "onClick",
            cb && (() => this.addToRaycastSet(clickSet))
        )
    }

    private _onMouseDown?: (e: LingoMouseEvent) => void
    public get onMouseDown() {
        return this._onMouseDown
    }
    public set onMouseDown(cb) {
        this._onMouseDown = cb
        this.cancelHandle(
            "onMouseDown",
            cb && (() => this.addToRaycastSet(mouseDownSet))
        )
    }

    private _onMouseUp?: (e: LingoMouseEvent) => void
    public get onMouseUp() {
        return this._onMouseUp
    }
    public set onMouseUp(cb) {
        this._onMouseUp = cb
        this.cancelHandle(
            "onMouseUp",
            cb && (() => this.addToRaycastSet(mouseUpSet))
        )
    }

    private _onMouseOver?: (e: LingoMouseEvent) => void
    public get onMouseOver() {
        return this._onMouseOver
    }
    public set onMouseOver(cb) {
        this._onMouseOver = cb
        this.cancelHandle(
            "onMouseOver",
            cb && (() => this.addToRaycastSet(mouseOverSet))
        )
    }

    private _onMouseOut?: (e: LingoMouseEvent) => void
    public get onMouseOut() {
        return this._onMouseOut
    }
    public set onMouseOut(cb) {
        this._onMouseOut = cb
        this.cancelHandle(
            "onMouseOut",
            cb && (() => this.addToRaycastSet(mouseOutSet))
        )
    }

    private _onMouseMove?: (e: LingoMouseEvent) => void
    public get onMouseMove() {
        return this._onMouseMove
    }
    public set onMouseMove(cb) {
        this._onMouseMove = cb
        this.cancelHandle(
            "onMouseMove",
            cb && (() => this.addToRaycastSet(mouseMoveSet))
        )
    }

    public hitTest(target: MeshAppendable) {
        if (this.done) return false
        if (target.done) return false
        if (this === target) return false

        thisOBB.set(
            getWorldPosition(this.object3d),
            vector3_1.clone(),
            new Matrix3()
        )
        thisOBB.applyMatrix4(this.object3d.matrixWorld)
        targetOBB.set(
            getWorldPosition(target.object3d),
            vector3_1.clone(),
            new Matrix3()
        )
        targetOBB.applyMatrix4(target.object3d.matrixWorld)
        return thisOBB.intersectsOBB(targetOBB)
    }

    private _hitTarget?:
        | string
        | Array<string>
        | MeshAppendable
        | Array<MeshAppendable>
    public get hitTarget() {
        return this._hitTarget
    }
    public set hitTarget(val) {
        this._hitTarget = val
        this.cancelHandle(
            "hitTarget",
            val &&
                (() => {
                    addHitTestSystem(this)
                    return new Cancellable(() => {
                        deleteHitTestSystem(this)
                    })
                })
        )
    }

    public onHit: Nullable<(instance: HitEvent) => void>
    public onHitStart: Nullable<(instance: HitEvent) => void>
    public onHitEnd: Nullable<(instance: HitEvent) => void>
}
