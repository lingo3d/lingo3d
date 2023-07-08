import { Object3D } from "three"
import MeshAppendable from "../MeshAppendable"
import { LingoMouseEvent } from "../../../interface/IMouse"
import IVisible, { HitEvent } from "../../../interface/IVisible"
import Nullable from "../../../interface/utils/Nullable"
import { obb, obb_ } from "../../utils/reusables"
import getRendered from "../../../throttle/getRendered"
import { hitTestSystem } from "../../../systems/hitTestSystem"
import { configCastShadowSystem } from "../../../systems/configLoadedSystems/configCastShadowSystem"
import { configOutlineSystem } from "../../../systems/configLoadedSystems/configOutlineSystem"
import { configSelectiveBloomSystem } from "../../../systems/configLoadedSystems/configSelectiveBloomSystem"
import setOBB from "../../utils/setOBB"
import { configReflectionVisibleSystem } from "../../../systems/configSystems/configReflectionVisibleSystem"
import { configRaycastSetSystem } from "../../../systems/configSystems/configRaycastSetSystem"
import { configRenderCheckSystem } from "../../../systems/configSystems/configRenderCheckSystem"

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
        this.$object.visible = !!val
    }

    private _reflectionVisible?: boolean
    public get reflectionVisible() {
        return this._reflectionVisible
    }
    public set reflectionVisible(val) {
        this._reflectionVisible = val
        val
            ? configReflectionVisibleSystem.add(this)
            : configReflectionVisibleSystem.delete(this)
    }

    public get isRendered() {
        configRenderCheckSystem.add(this)
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

    private _onClick?: (e: LingoMouseEvent) => void
    public get onClick() {
        return this._onClick
    }
    public set onClick(cb) {
        this._onClick = cb
        configRaycastSetSystem.add(this)
    }

    private _onMouseDown?: (e: LingoMouseEvent) => void
    public get onMouseDown() {
        return this._onMouseDown
    }
    public set onMouseDown(cb) {
        this._onMouseDown = cb
        configRaycastSetSystem.add(this)
    }

    private _onMouseUp?: (e: LingoMouseEvent) => void
    public get onMouseUp() {
        return this._onMouseUp
    }
    public set onMouseUp(cb) {
        this._onMouseUp = cb
        configRaycastSetSystem.add(this)
    }

    private _onMouseOver?: (e: LingoMouseEvent) => void
    public get onMouseOver() {
        return this._onMouseOver
    }
    public set onMouseOver(cb) {
        this._onMouseOver = cb
        configRaycastSetSystem.add(this)
    }

    private _onMouseOut?: (e: LingoMouseEvent) => void
    public get onMouseOut() {
        return this._onMouseOut
    }
    public set onMouseOut(cb) {
        this._onMouseOut = cb
        configRaycastSetSystem.add(this)
    }

    private _onMouseMove?: (e: LingoMouseEvent) => void
    public get onMouseMove() {
        return this._onMouseMove
    }
    public set onMouseMove(cb) {
        this._onMouseMove = cb
        configRaycastSetSystem.add(this)
    }

    public hitTest(target: MeshAppendable) {
        if (this.done) return false
        if (target.done) return false
        if (this === target) return false

        setOBB(this.$innerObject, obb)
        setOBB(target.$innerObject, obb_)
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
