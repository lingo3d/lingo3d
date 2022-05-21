import { Object3D } from "three"
import getCenter from "../../display/utils/getCenter"
import { vector3_ } from "../../display/utils/reusables"
import { vec2Point } from "../../display/utils/vec2Point"
import { scaleUp, scaleDown } from "../../engine/constants"
import IPositioned from "../../interface/IPositioned"
import EventLoopItem from "./EventLoopItem"

export default abstract class PositionedItem extends EventLoopItem implements IPositioned {
    public object3d?: Object3D

    public get x() {
        return this.outerObject3d.position.x * scaleUp
    }
    public set x(val: number) {
        this.outerObject3d.position.x = val * scaleDown
    }

    public get y() {
        return this.outerObject3d.position.y * scaleUp
    }
    public set y(val: number) {
        this.outerObject3d.position.y = val * scaleDown
    }

    public get z() {
        return this.outerObject3d.position.z * scaleUp
    }
    public set z(val: number) {
        this.outerObject3d.position.z = val * scaleDown
    }

    public getWorldPosition() {
        return vec2Point((this.object3d ?? this.outerObject3d).getWorldPosition(vector3_))
    }

    public getCenter() {
        return vec2Point(getCenter((this.object3d ?? this.outerObject3d)))
    }
}