import { rad2Deg, deg2Rad } from "@lincode/math"
import { Object3D, Quaternion } from "three"
import { TransformControlsPhase } from "../../../events/onTransformControls"
import IDirectioned from "../../../interface/IDirectioned"

export default abstract class DirectionedMixin<T extends Object3D = Object3D>
    implements IDirectioned
{
    public declare outerObject3d: T
    public declare object3d: T
    public declare quaternion: Quaternion

    public get rotationX() {
        return this.outerObject3d.rotation.x * rad2Deg
    }
    public set rotationX(val) {
        this.outerObject3d.rotation.x = val * deg2Rad
    }

    public get rotationY() {
        return this.outerObject3d.rotation.y * rad2Deg
    }
    public set rotationY(val) {
        this.outerObject3d.rotation.y = val * deg2Rad
    }

    public get rotationZ() {
        return this.outerObject3d.rotation.z * rad2Deg
    }
    public set rotationZ(val) {
        this.outerObject3d.rotation.z = val * deg2Rad
    }

    public get rotation() {
        return this.rotationZ
    }
    public set rotation(val) {
        this.rotationZ = val
    }

    public get onRotateControl() {
        return this.outerObject3d.userData.onRotateControl
    }
    public set onRotateControl(
        cb: ((phase: TransformControlsPhase) => void) | undefined
    ) {
        this.outerObject3d.userData.onRotateControl = cb
    }
}
