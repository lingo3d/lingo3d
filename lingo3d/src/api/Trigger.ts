import { Reactive } from "@lincode/reactivity"
import { Group } from "three"
import SimpleObjectManager, { idMap } from "../display/core/SimpleObjectManager"
import getWorldPosition from "../display/utils/getWorldPosition"
import { scaleDown } from "../engine/constants"
import ITrigger, { triggerDefaults } from "../interface/ITrigger"

const getTargets = (id: string) => [...(idMap.get(id) ?? [])]

export default class Trigger extends SimpleObjectManager implements ITrigger {
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
        super(new Group())

        this.createEffect(() => {
            const { _radius, _interval, _helper, _targetIds } = this
            if (!_targetIds) return

            const targets = _targetIds.map(getTargets).flat()
            const r = _radius * scaleDown

            let hitOld = false

            const interval = setInterval(() => {
                const { x, y, z } = getWorldPosition(this.outerObject3d)

                for (const target of targets) {
                    const { x: tx, y: ty, z: tz} = getWorldPosition(target.object3d)
                    const hit = Math.abs(x - tx) < r || Math.abs(y - ty) < r || Math.abs(z - tz) < r

                    if (hitOld !== hit)
                        if (hit)
                            this.onEnter?.(target)
                        else
                            this.onExit?.(target)
                            
                    hitOld = hit
                }
            }, _interval)

            return () => {
                clearInterval(interval)
            }
        }, [this.refresh.get])
    }
}