import { Point3d } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { forceGet } from "@lincode/utils"
import { Object3D } from "three"
import getWorldPosition from "../../display/utils/getWorldPosition"
import { positionChanged } from "../../display/utils/trackObject"
import { vec2Point } from "../../display/utils/vec2Point"
import { scaleUp, scaleDown } from "../../engine/constants"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import IPositioned from "../../interface/IPositioned"
import EventLoopItem from "./EventLoopItem"

const onMoveMap = new Map<PositionedItem, Set<() => void>>()

export const onPositionedItemMove = (item: PositionedItem, cb: () => void) => {
    cb()
    const set = forceGet(onMoveMap, item, makeSet)
    set.add(cb)
    return new Cancellable(() => set.delete(cb))
}

onBeforeRender(() => {
    let toDelete: Array<PositionedItem> = []
    for (const [item, cbs] of onMoveMap) {
        if (item.done || !cbs.size) {
            toDelete.push(item)
            continue
        }
        if (positionChanged(item.outerObject3d)) for (const cb of cbs) cb()
    }
    for (const item of toDelete) onMoveMap.delete(item)
    toDelete = []
})

const makeSet = () => new Set<() => void>()

export default abstract class PositionedItem<T extends Object3D = Object3D>
    extends EventLoopItem<T>
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
            cb && (() => onPositionedItemMove(this, cb))
        )
    }
}

export const isPositionedItem = (item: any): item is PositionedItem =>
    item instanceof EventLoopItem && "x" in item
