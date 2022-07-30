import { Point3d } from "@lincode/math"
import { Object3D } from "three"
import { getObject3d } from "../../display/core/MeshItem"
import getWorldPosition from "../../display/utils/getWorldPosition"
import { vec2Point } from "../../display/utils/vec2Point"
import { scaleUp, scaleDown } from "../../engine/constants"
import IPositioned from "../../interface/IPositioned"
import EventLoopItem from "./EventLoopItem"

export default abstract class PositionedItem<T extends Object3D = Object3D>
    extends EventLoopItem<T>
    implements IPositioned
{
    public get x() {
        return this.outerObject3d.position.x * scaleUp
    }
    public set x(val) {
        this.outerObject3d.position.x = val * scaleDown
    }

    public get y() {
        return this.outerObject3d.position.y * scaleUp
    }
    public set y(val) {
        this.outerObject3d.position.y = val * scaleDown
    }

    public get z() {
        return this.outerObject3d.position.z * scaleUp
    }
    public set z(val) {
        this.outerObject3d.position.z = val * scaleDown
    }

    public getWorldPosition(): Point3d {
        return vec2Point(getWorldPosition(getObject3d(this)))
    }
}

export const isPositionedItem = (item: any): item is PositionedItem =>
    item instanceof EventLoopItem && "x" in item
