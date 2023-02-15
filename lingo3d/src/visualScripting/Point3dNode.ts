import Appendable from "../api/core/Appendable"
import IPoint3dNode, {
    point3dNodeDefaults,
    point3dNodeSchema
} from "../interface/IPoint3dNode"

export default class Point3dNode extends Appendable implements IPoint3dNode {
    public static componentName = "point3dNode"
    public static defaults = point3dNodeDefaults
    public static schema = point3dNodeSchema
    public static includeKeys = ["x", "y", "z", "position"]

    public position = { x: 0, y: 0, z: 0 }

    public get x() {
        return this.position.x
    }
    public set x(val) {
        this.position = { ...this.position, x: val }
    }

    public get y() {
        return this.position.y
    }
    public set y(val) {
        this.position = { ...this.position, y: val }
    }

    public get z() {
        return this.position.z
    }
    public set z(val) {
        this.position = { ...this.position, z: val }
    }
}
