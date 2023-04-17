import { Cancellable } from "@lincode/promiselikes"
import Appendable, { getAppendablesById } from "../api/core/Appendable"
import Model from "./Model"

export default class ExplodeView extends Appendable {
    private _target?: string
    public get target() {
        return this._target
    }
    public set target(val) {
        this._target = val
        this.cancelHandle(
            "explodeViewTarget",
            val &&
                (() => {
                    const [manager] = getAppendablesById(val)
                    if (!(manager instanceof Model)) return new Cancellable()

                    const parts = manager.findAll()
                    const destinations = parts.map((part) => {
                        // const direction = mathFn.normalize(part.getCenter())
                    })

                    return new Cancellable(() => {})
                })
        )
    }
}
