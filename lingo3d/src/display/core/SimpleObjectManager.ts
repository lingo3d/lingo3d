import { Object3D } from "three"
import ISimpleObjectManager from "../../interface/ISimpleObjectManager"
import AnimatedObjectManager from "./AnimatedObjectManager"

export default class SimpleObjectManager<T extends Object3D = Object3D>
    extends AnimatedObjectManager<T>
    implements ISimpleObjectManager
{
    public get scaleX() {
        return this.$object.scale.x
    }
    public set scaleX(val) {
        this.$object.scale.x = val
    }

    public get scaleY() {
        return this.$object.scale.y
    }
    public set scaleY(val) {
        this.$object.scale.y = val
    }

    public get scaleZ() {
        return this.$object.scale.z
    }
    public set scaleZ(val) {
        this.$object.scale.z = val
    }

    public get scale() {
        return this.scaleX
    }
    public set scale(val) {
        this.scaleX = val
        this.scaleY = val
        this.scaleZ = val
    }
}
