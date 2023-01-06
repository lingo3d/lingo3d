import { CircleGeometry } from "three"
import Primitive from "../core/Primitive"
import ICircle, { circleDefaults, circleSchema } from "../../interface/ICircle"
import { deg2Rad } from "@lincode/math"
import { forceGetInstance } from "../../utils/forceGetInstance"

const circleGeometry = new CircleGeometry(0.5)

const thetaGeometryMap = new Map<number, CircleGeometry>()
const allocate = (theta: number) => {
    return forceGetInstance(thetaGeometryMap, theta, CircleGeometry)
}

export default class Circle extends Primitive implements ICircle {
    public static componentName = "circle"
    public static override defaults = circleDefaults
    public static override schema = circleSchema

    public constructor() {
        super(circleGeometry)
        this.object3d.scale.z = Number.EPSILON
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}

    private _theta?: number
    public get theta() {
        return this._theta ?? 360
    }
    public set theta(val) {
        this._theta = val
        const { geometry } = this.object3d
        geometry !== circleGeometry && geometry.dispose()
        this.object3d.geometry =
            val === 360
                ? circleGeometry
                : new CircleGeometry(0.5, 32, 0, val * deg2Rad)
    }
}
