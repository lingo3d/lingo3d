import { Point3d } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import canvasToWorld from "../display/utils/canvasToWorld"

export default class CanvasToWorld extends Appendable {
    private refresh = new Reactive({})

    private _x = 0
    public get x() {
        return this._x
    }
    public set x(value) {
        this._x = value
        this.refresh.set({})
    }

    private _y = 0
    public get y() {
        return this._y
    }
    public set y(value) {
        this._y = value
        this.refresh.set({})
    }

    private _distance = 500
    public get distance() {
        return this._distance
    }
    public set distance(value) {
        this._distance = value
        this.refresh.set({})
    }

    public output = new Point3d(0, 0, 0)

    public constructor() {
        super()

        this.createEffect(() => {
            this.output = canvasToWorld(this._x, this._y, this._distance)
        }, [this.refresh])
    }
}
