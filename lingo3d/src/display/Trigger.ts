import { Reactive } from "@lincode/reactivity"
import getActualScale from "./utils/getActualScale"
import getWorldPosition from "./utils/getWorldPosition"
import { scaleDown } from "../engine/constants"
import { timer } from "../engine/eventLoop"
import mainCamera from "../engine/mainCamera"
import ITrigger, { triggerDefaults, triggerSchema } from "../interface/ITrigger"
import PositionedItem from "../api/core/PositionedItem"
import { getCameraRendered } from "../states/useCameraRendered"
import StaticObjectManager, {
    getMeshItemSets
} from "./core/StaticObjectManager"
import { addSelectionHelper } from "./core/StaticObjectManager/raycast/selectionCandidates"
import MeshItem from "./core/MeshItem"
import HelperCylinder from "./core/utils/HelperCylinder"
import HelperSphere from "./core/utils/HelperSphere"

export default class Trigger extends PositionedItem implements ITrigger {
    public static componentName = "trigger"
    public static defaults = triggerDefaults
    public static schema = triggerSchema

    private refresh = new Reactive({})

    public onEnter: ((target: MeshItem) => void) | undefined

    public onExit: (() => void) | undefined

    private _pad = false
    public get pad() {
        return this._pad
    }
    public set pad(val) {
        this._pad = val
        this.refresh.set({})
    }

    private _radius = 50
    public get radius() {
        return this._radius
    }
    public set radius(val) {
        this._radius = val
        this.refresh.set({})
    }

    private _interval = 300
    public get interval() {
        return this._interval
    }
    public set interval(val) {
        this._interval = val
        this.refresh.set({})
    }

    private _helper = true
    public get helper() {
        return this._helper
    }
    public set helper(val) {
        this._helper = val
        this.refresh.set({})
    }

    private _target?: string | Array<string> | StaticObjectManager
    public get target() {
        return this._target
    }
    public set target(val) {
        this._target = val
        this.refresh.set({})
    }

    public constructor() {
        super()

        let helper: HelperCylinder | HelperSphere | undefined

        this.createEffect(() => {
            const { _radius, _interval, _target, _pad } = this
            if (!_target) return

            const targetSets = getMeshItemSets(_target)

            const r = _radius * scaleDown
            const pr = r * 0.2

            let hitOld = false
            const handle = timer(_interval, -1, () => {
                const { x, y, z } = getWorldPosition(this.outerObject3d)

                let hit = false
                let targetHit: MeshItem | undefined
                for (const targetSet of targetSets)
                    for (const target of targetSet) {
                        const {
                            x: tx,
                            y: ty,
                            z: tz
                        } = getWorldPosition(target.nativeObject3d)
                        if (_pad) {
                            const { y: sy } = getActualScale(target)
                            hit =
                                Math.abs(x - tx) < r &&
                                Math.abs(y - (ty - sy * 0.5)) < pr &&
                                Math.abs(z - tz) < r
                        } else
                            hit =
                                Math.abs(x - tx) < r &&
                                Math.abs(y - ty) < r &&
                                Math.abs(z - tz) < r

                        if (hit) {
                            targetHit = target
                            break
                        }
                    }
                if (hitOld !== hit)
                    if (hit && targetHit) {
                        this.onEnter?.(targetHit)
                        helper && (helper.color = "blue")
                    } else {
                        this.onExit?.()
                        helper && (helper.color = "white")
                    }
                hitOld = hit
            })
            return () => {
                handle.cancel()
            }
        }, [this.refresh.get])

        this.createEffect(() => {
            const { _radius, _helper, _pad } = this
            if (!_helper || getCameraRendered() !== mainCamera) return

            helper = _pad ? new HelperCylinder() : new HelperSphere()
            const handle = addSelectionHelper(helper, this)
            helper.scale = _radius * scaleDown * 2
            helper.height = _pad ? 10 : 100

            return () => {
                helper!.dispose()
                helper = undefined
                handle.cancel()
            }
        }, [this.refresh.get, getCameraRendered])
    }
}
