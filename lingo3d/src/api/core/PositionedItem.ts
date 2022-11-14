import { Point3d } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { forceGet, lazy } from "@lincode/utils"
import { Object3D } from "three"
import getWorldPosition from "../../display/utils/getWorldPosition"
import { positionChanged } from "../../display/utils/trackObject"
import { vec2Point } from "../../display/utils/vec2Point"
import { scaleUp, scaleDown } from "../../engine/constants"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import IPositioned from "../../interface/IPositioned"
import Appendable from "./Appendable"

const lazyObjectLoop = lazy(() =>
    onBeforeRender(() => {
        for (const [item, cbs] of onMoveMap)
            if (positionChanged(item)) for (const cb of cbs) cb()
    })
)

const onMoveMap = new Map<Object3D, Set<() => void>>()
export const onObjectMove = (item: Object3D, cb: () => void) => {
    lazyObjectLoop()
    const set = forceGet(onMoveMap, item, makeSet)
    set.add(cb)
    return new Cancellable(() => {
        set.delete(cb)
        !set.size && onMoveMap.delete(item)
    })
}

const makeSet = () => new Set<() => void>()

export default abstract class PositionedItem<T extends Object3D = Object3D>
    extends Appendable<T>
    implements IPositioned
{
    public constructor(outerObject3d: T = new Object3D() as T) {
        super(outerObject3d)
        scene.add(outerObject3d)
    }

    public get x() {
        return this.outerObject3d.position.x * scaleUp
    }
    public set x(val) {
        this.outerObject3d.position.x = val * scaleDown
    }

    public get y() {
        return this.outerObject3d.position.y * scaleUp
    }
    public set y(val) {
        this.outerObject3d.position.y = val * scaleDown
    }

    public get z() {
        return this.outerObject3d.position.z * scaleUp
    }
    public set z(val) {
        this.outerObject3d.position.z = val * scaleDown
    }

    public getWorldPosition(): Point3d {
        return vec2Point(getWorldPosition(this.nativeObject3d))
    }

    private _onMove?: () => void
    public get onMove() {
        return this._onMove
    }
    public set onMove(cb) {
        this._onMove = cb
        this.cancelHandle(
            "onMove",
            cb && (() => onObjectMove(this.outerObject3d, cb))
        )
    }
}

export const isPositionedItem = (item: any): item is PositionedItem =>
    item instanceof Appendable && "x" in item
