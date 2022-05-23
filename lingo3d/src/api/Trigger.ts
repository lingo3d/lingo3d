import { Reactive } from "@lincode/reactivity"
import { Group } from "three"
import { idMap } from "../display/core/SimpleObjectManager"
import Cylinder from "../display/primitives/Cylinder"
import Sphere from "../display/primitives/Sphere"
import getActualScale from "../display/utils/getActualScale"
import getWorldPosition from "../display/utils/getWorldPosition"
import { scaleDown } from "../engine/constants"
import { timer } from "../engine/eventLoop"
import mainCamera from "../engine/mainCamera"
import scene from "../engine/scene"
import { emitSelectionTarget, onSelectionTarget } from "../events/onSelectionTarget"
import ITrigger, { triggerDefaults, triggerSchema } from "../interface/ITrigger"
import { getCamera } from "../states/useCamera"
import { appendableRoot } from "./core/Appendable"
import PositionedItem from "./core/PositionedItem"

const getTargets = (id: string) => [...(idMap.get(id) ?? [])]

export default class Trigger extends PositionedItem implements ITrigger {
    public static componentName = "trigger"
    public static defaults = triggerDefaults
    public static schema = triggerSchema

    private refresh = new Reactive({})

    public onEnter: (() => void) | undefined
    
    public onExit: (() => void) | undefined

    private _pad = triggerDefaults.pad
    public get pad() {
        return this._pad
    }
    public set pad(val) {
        this._pad = val
        this.refresh.set({})
    }
    
    private _radius = triggerDefaults.radius
    public get radius() {
        return this._radius
    }
    public set radius(val) {
        this._radius = val
        this.refresh.set({})
    }

    private _interval = triggerDefaults.interval
    public get interval() {
        return this._interval
    }
    public set interval(val) {
        this._interval = val
        this.refresh.set({})
    }

    private _helper = triggerDefaults.helper
    public get helper() {
        return this._helper
    }
    public set helper(val) {
        this._helper = val
        this.refresh.set({})
    }

    private _targetIds = triggerDefaults.targetIds
    public get targetIds() {
        return this._targetIds
    }
    public set targetIds(val) {
        this._targetIds = val
        this.refresh.set({})
    }

    public constructor() {
        const group = new Group()
        super(group)
        scene.add(group)

        let helper: Cylinder | Sphere | undefined

        this.createEffect(() => {
            const { _radius, _interval, _targetIds, _pad } = this
            if (!_targetIds) return

            const r = _radius * scaleDown
            const pr = r * 0.2

            let hitOld = false
            const handle = timer(_interval, -1, () => {
                const { x, y, z } = getWorldPosition(this.outerObject3d)
                const targets = typeof _targetIds === "string" ? getTargets(_targetIds) : _targetIds.map(getTargets).flat()
                
                let hit = false
                for (const target of targets) {
                    const { x: tx, y: ty, z: tz} = getWorldPosition(target.object3d)
                    if (_pad) {
                        const { y: sy } = getActualScale(target)
                        hit = Math.abs(x - tx) < r && Math.abs(y - (ty - sy * 0.5)) < pr && Math.abs(z - tz) < r
                    }
                    else
                        hit = Math.abs(x - tx) < r && Math.abs(y - ty) < r && Math.abs(z - tz) < r

                    if (hit) break
                }
                if (hitOld !== hit)
                    if (hit) {
                        this.onEnter?.()
                        helper && (helper.color = "blue")
                    }
                    else {
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
            if (!_helper) return

            if (getCamera() !== mainCamera) return

            const h = helper = _pad ? new Cylinder() : new Sphere()
            appendableRoot.delete(h)
            group.add(h.outerObject3d)
            h.scale = _radius * scaleDown * 2
            h.opacity = 0.5
            h.height = _pad ? 10 : 100

            const handle = onSelectionTarget(target => target === h && emitSelectionTarget(this))

            return () => {
                h.dispose()
                helper = undefined
                handle.cancel()
            }
        }, [this.refresh.get, getCamera])
    }
}