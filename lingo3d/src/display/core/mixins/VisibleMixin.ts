import { Cancellable } from "@lincode/promiselikes"
import { Object3D } from "three"
import MeshAppendable from "../MeshAppendable"
import { LingoMouseEvent } from "../../../interface/IMouse"
import IVisible, { HitEvent } from "../../../interface/IVisible"
import Nullable from "../../../interface/utils/Nullable"
import { obb, obb_ } from "../../utils/reusables"
import { reflectionVisibleSet } from "../../../collections/reflectionCollections"
import {
    clickSet,
    mouseDownSet,
    mouseMoveSet,
    mouseOutSet,
    mouseOverSet,
    mouseUpSet
} from "../../../collections/mouseSets"
import { idRenderCheckMap } from "../../../collections/idCollections"
import getRendered from "../../../throttle/getRendered"
import { hitTestSystem } from "../../../systems/hitTestSystem"
import { configCastShadowSystem } from "../../../systems/configLoadedSystems/configCastShadowSystem"
import { configOutlineSystem } from "../../../systems/configLoadedSystems/configOutlineSystem"
import { configSelectiveBloomSystem } from "../../../systems/configLoadedSystems/configSelectiveBloomSystem"
import setOBB from "../../utils/setOBB"

export default abstract class VisibleMixin<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IVisible
{
    private _bloom?: boolean
    public get bloom() {
        return this._bloom
    }
    public set bloom(val) {
        this._bloom = val
        configSelectiveBloomSystem.add(this)
    }

    private _outline?: boolean
    public get outline() {
        return this._outline
    }
    public set outline(val) {
        this._outline = val
        configOutlineSystem.add(this)
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

    private initRenderCheck?: boolean
    public get isRendered() {
        if (!this.initRenderCheck) {
            this.initRenderCheck = true
            idRenderCheckMap.set(this.object3d.id, this)
        }
        return getRendered().has(this)
    }

    private _castShadow?: boolean
    public get castShadow() {
        return (this._castShadow ??= true)
    }
    public set castShadow(val) {
        this._castShadow = val
        configCastShadowSystem.add(this)
    }

    public $addToRaycastSet(set: Set<Object3D>) {
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
            cb && (() => this.$addToRaycastSet(clickSet))
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
            cb && (() => this.$addToRaycastSet(mouseDownSet))
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
            cb && (() => this.$addToRaycastSet(mouseUpSet))
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
            cb && (() => this.$addToRaycastSet(mouseOverSet))
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
            cb && (() => this.$addToRaycastSet(mouseOutSet))
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
            cb && (() => this.$addToRaycastSet(mouseMoveSet))
        )
    }

    public hitTest(target: MeshAppendable) {
        if (this.done) return false
        if (target.done) return false
        if (this === target) return false

        setOBB(this.object3d, obb)
        setOBB(target.object3d, obb_)
        return obb.intersectsOBB(obb_)
    }

    private _hitTarget?: string | Array<string>
    public get hitTarget() {
        return this._hitTarget
    }
    public set hitTarget(val) {
        this._hitTarget = val
        val ? hitTestSystem.add(this) : hitTestSystem.delete(this)
    }

    public onHit: Nullable<(instance: HitEvent) => void>
    public onHitStart: Nullable<(instance: HitEvent) => void>
    public onHitEnd: Nullable<(instance: HitEvent) => void>
}
