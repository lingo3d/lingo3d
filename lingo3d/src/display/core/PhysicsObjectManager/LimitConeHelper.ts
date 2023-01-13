import Group from "../../Group"
import Circle from "../../primitives/Circle"

export default class LimitConeHelper extends Group {
    private yCircle = new Circle()
    private zCircle = new Circle()

    public constructor() {
        super()
        this.append(this.yCircle)
        this.append(this.zCircle)
        this.yAngle = 45
        this.zAngle = 45
    }

    public get yAngle() {
        return this.yCircle.theta
    }
    public set yAngle(val) {
        this.yCircle.theta = val
    }

    public get zAngle() {
        return this.zCircle.theta
    }
    public set zAngle(val) {
        this.zCircle.theta = val
    }
}
