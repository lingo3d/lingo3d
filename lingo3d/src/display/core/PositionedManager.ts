import { Point3d } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { forceGet, lazy } from "@lincode/utils"
import { Object3D } from "three"
import getWorldPosition from "../utils/getWorldPosition"
import { positionChanged } from "../utils/trackObject"
import { vec2Point } from "../utils/vec2Point"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import { CM2M, M2CM } from "../../globals"
import IPositioned from "../../interface/IPositioned"
import MeshAppendable from "../../api/core/MeshAppendable"

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

export default abstract class PositionedManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IPositioned
{
    public constructor(outerObject3d: T = new Object3D() as T) {
        super(outerObject3d)
        scene.add(outerObject3d)
    }

    public get x() {
        return this.position.x * M2CM
    }
    public set x(val) {
        this.position.x = val * CM2M
    }

    public get y() {
        return this.position.y * M2CM
    }
    public set y(val) {
        this.position.y = val * CM2M
    }

    public get z() {
        return this.position.z * M2CM
    }
    public set z(val) {
        this.position.z = val * CM2M
    }

    public getWorldPosition(): Point3d {
        return vec2Point(getWorldPosition(this.object3d))
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

export const isPositionedManager = (item: any): item is PositionedManager =>
    item instanceof MeshAppendable && "x" in item
