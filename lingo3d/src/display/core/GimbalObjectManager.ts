import { Object3D } from "three"
import IGimbalObjectManager from "../../interface/IGimbalObjectManager"
import { setManager } from "./utils/getManager"
import { CM2M, M2CM } from "../../globals"
import SimpleObjectManager from "./SimpleObjectManager"
import { DEG2RAD, RAD2DEG } from "three/src/math/MathUtils"

export default abstract class GimbalObjectManager<T extends Object3D = Object3D>
    extends SimpleObjectManager<T>
    implements IGimbalObjectManager
{
    public constructor($innerObject = new Object3D() as T) {
        super(new Object3D() as T)
        this.$innerObject = $innerObject
        setManager($innerObject, this)
        this.$object.add($innerObject)
    }

    public get innerRotationX() {
        return this.$innerObject.rotation.x * RAD2DEG
    }
    public set innerRotationX(val) {
        this.$innerObject.rotation.x = val * DEG2RAD
    }

    public get innerRotationY() {
        return this.$innerObject.rotation.y * RAD2DEG
    }
    public set innerRotationY(val) {
        this.$innerObject.rotation.y = val * DEG2RAD
    }

    public get innerRotationZ() {
        return this.$innerObject.rotation.z * RAD2DEG
    }
    public set innerRotationZ(val) {
        this.$innerObject.rotation.z = val * DEG2RAD
    }

    public get innerX() {
        return this.$innerObject.position.x * M2CM
    }
    public set innerX(val) {
        this.$innerObject.position.x = val * CM2M
    }

    public get innerY() {
        return this.$innerObject.position.y * M2CM
    }
    public set innerY(val) {
        this.$innerObject.position.y = val * CM2M
    }

    public get innerZ() {
        return this.$innerObject.position.z * M2CM
    }
    public set innerZ(val) {
        this.$innerObject.position.z = val * CM2M
    }

    public get width() {
        return this.$innerObject.scale.x * M2CM
    }
    public set width(val) {
        this.$innerObject.scale.x = val * CM2M
    }

    public get height() {
        return this.$innerObject.scale.y * M2CM
    }
    public set height(val) {
        this.$innerObject.scale.y = val * CM2M
    }

    public get depth() {
        return this.$innerObject.scale.z * M2CM
    }
    public set depth(val) {
        this.$innerObject.scale.z = val * CM2M
    }
}
