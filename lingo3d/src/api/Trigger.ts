import { Reactive } from "@lincode/reactivity"
import { Group } from "three"
import SimpleObjectManager, { idMap } from "../display/core/SimpleObjectManager"
import Cylinder from "../display/primitives/Cylinder"
import getWorldPosition from "../display/utils/getWorldPosition"
import { scaleDown } from "../engine/constants"
import mainCamera from "../engine/mainCamera"
import scene from "../engine/scene"
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

    public onEnter: ((target: SimpleObjectManager) => void) | undefined
    
    public onExit: ((target: SimpleObjectManager) => void) | undefined

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

        let helper: Cylinder | undefined

        this.createEffect(() => {
            const { _radius, _interval, _targetIds } = this
            if (!_targetIds) return

            const r = _radius * scaleDown

            let hitOld = false

            const interval = setInterval(() => {
                const { x, y, z } = getWorldPosition(this.outerObject3d)
                const targets = (typeof _targetIds === "string" ? [_targetIds] : _targetIds).map(getTargets).flat()

                for (const target of targets) {
                    const { x: tx, y: ty, z: tz} = getWorldPosition(target.object3d)
                    const hit = Math.abs(x - tx) < r && Math.abs(y - ty) < r && Math.abs(z - tz) < r

                    if (hitOld !== hit)
                        if (hit) {
                            this.onEnter?.(target)
                            helper && (helper.color = "blue")
                        }
                        else {
                            this.onExit?.(target)
                            helper && (helper.color = "white")
                        }
                    hitOld = hit
                }
            }, _interval)

            return () => {
                clearInterval(interval)
            }
        }, [this.refresh.get])

        this.createEffect(() => {
            const { _radius, _helper } = this
            if (!_helper) return

            if (getCamera() !== mainCamera) return

            const h = helper = new Cylinder()
            appendableRoot.delete(h)
            group.add(h.outerObject3d)
            h.scale = _radius * scaleDown * 2
            h.opacity = 0.5

            return () => {
                h.dispose()
                helper = undefined
            }
        }, [this.refresh.get, getCamera])
    }
}