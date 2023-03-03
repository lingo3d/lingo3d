import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import canvasToWorld from "../display/utils/canvasToWorld"
import IProjectionNode, {
    projectionNodeDefaults,
    projectionNodeSchema
} from "../interface/IProjectNode"

export default class ProjectionNode extends Appendable implements IProjectionNode {
    public static componentName = "projectNode"
    public static defaults = projectionNodeDefaults
    public static schema = projectionNodeSchema
    public static includeKeys = [
        "x",
        "y",
        "distance",
        "outputX",
        "outputY",
        "outputZ"
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

    public outputX = 0
    public outputY = 0
    public outputZ = 0

    public constructor() {
        super()

        this.createEffect(() => {
            const pt = canvasToWorld(this._x, this._y, this._distance)
            this.outputX = pt.x
            this.outputY = pt.y
            this.outputZ = pt.z
        }, [this.refresh.get])
    }
}
