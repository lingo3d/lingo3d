import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import canvasToWorld from "../display/utils/canvasToWorld"
import IProjectionNode, {
    projectionNodeDefaults,
    projectionNodeSchema
} from "../interface/IProjectionNode"

export default class ProjectionNode extends Appendable implements IProjectionNode {
    public static componentName = "projectNode"
    public static defaults = projectionNodeDefaults
    public static schema = projectionNodeSchema
    public static includeKeys = [
        "x",
        "y",
        "distance",
        "outX",
        "outY",
        "outZ"
    ]

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

    public outX = 0
    public outY = 0
    public outZ = 0

    public constructor() {
        super()

        this.createEffect(() => {
            const pt = canvasToWorld(this._x, this._y, this._distance)
            this.outX = pt.x
            this.outY = pt.y
            this.outZ = pt.z
        }, [this.refresh.get])
    }
}
