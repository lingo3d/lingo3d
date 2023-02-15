import Appendable from "../api/core/Appendable"
import IPoint3dNode from "../interface/IPoint3dNode"

export default class Point3dNode extends Appendable implements IPoint3dNode {
    public x = 0
    public y = 0
    public z = 0
}
