import { Object3D } from "three"
import { deg2Rad, rad2Deg } from "@lincode/math"
import IObjectManager from "../../interface/IObjectManager"
import { setManager } from "./utils/getManager"
import { CM2M, M2CM } from "../../globals"
import SimpleObjectManager from "./SimpleObjectManager"

export default abstract class GimbalObjectManager<T extends Object3D = Object3D>
    extends SimpleObjectManager<T>
    implements IObjectManager
{
    public constructor(object3d = new Object3D() as T) {
        super(new Object3D() as T)
        this.object3d = object3d
        setManager(object3d, this)
        this.outerObject3d.add(object3d)
    }

    public get innerRotationX() {
        return this.object3d.rotation.x * rad2Deg
    }
    public set innerRotationX(val) {
        this.object3d.rotation.x = val * deg2Rad
    }

    public get innerRotationY() {
        return this.object3d.rotation.y * rad2Deg
    }
    public set innerRotationY(val) {
        this.object3d.rotation.y = val * deg2Rad
    }

    public get innerRotationZ() {
        return this.object3d.rotation.z * rad2Deg
    }
    public set innerRotationZ(val) {
        this.object3d.rotation.z = val * deg2Rad
    }

    public get innerX() {
        return this.object3d.position.x * M2CM
    }
    public set innerX(val) {
        this.object3d.position.x = val * CM2M
    }

    public get innerY() {
        return this.object3d.position.y * M2CM
    }
    public set innerY(val) {
        this.object3d.position.y = val * CM2M
    }

    public get innerZ() {
        return this.object3d.position.z * M2CM
    }
    public set innerZ(val) {
        this.object3d.position.z = val * CM2M
    }

    public get width() {
        return this.object3d.scale.x * M2CM
    }
    public set width(val) {
        this.object3d.scale.x = val * CM2M
    }

    public get height() {
        return this.object3d.scale.y * M2CM
    }
    public set height(val) {
        this.object3d.scale.y = val * CM2M
    }

    public get depth() {
        return this.object3d.scale.z * M2CM
    }
    public set depth(val) {
        this.object3d.scale.z = val * CM2M
    }
}
