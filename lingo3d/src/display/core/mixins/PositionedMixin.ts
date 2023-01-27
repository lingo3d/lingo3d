import { Point3d } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { lazy, forceGetInstance } from "@lincode/utils"
import { Object3D, Vector3 } from "three"
import { onBeforeRender } from "../../../events/onBeforeRender"
import {
    TransformControlsMode,
    TransformControlsPhase
} from "../../../events/onTransformControls"
import { M2CM, CM2M } from "../../../globals"
import IPositioned from "../../../interface/IPositioned"
import getWorldPosition from "../../utils/getWorldPosition"
import { positionChanged } from "../../utils/trackObject"
import { vec2Point } from "../../utils/vec2Point"

const lazyObjectLoop = lazy(() =>
    onBeforeRender(() => {
        for (const [item, cbs] of onMoveMap)
            if (positionChanged(item)) for (const cb of cbs) cb()
    })
)

const onMoveMap = new Map<Object3D, Set<() => void>>()
export const onObjectMove = (item: Object3D, cb: () => void) => {
    lazyObjectLoop()
    const set = forceGetInstance(onMoveMap, item, Set)
    set.add(cb)
    return new Cancellable(() => {
        set.delete(cb)
        !set.size && onMoveMap.delete(item)
    })
}

export default abstract class PositionedMixin<T extends Object3D = Object3D>
    implements IPositioned
{
    public declare outerObject3d: T
    public declare object3d: T
    public declare position: Vector3

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
        //@ts-ignore
        this.cancelHandle(
            "onMove",
            cb && (() => onObjectMove(this.outerObject3d, cb))
        )
    }

    public get onTransformControls() {
        return this.outerObject3d.userData.onTransformControls
    }
    public set onTransformControls(
        cb:
            | ((
                  phase: TransformControlsPhase,
                  mode: TransformControlsMode
              ) => void)
            | undefined
    ) {
        this.outerObject3d.userData.onTransformControls = cb
    }
}
