import { rad2Deg, deg2Rad } from "@lincode/math"
import { Object3D } from "three"
import { quaternion, vector3 } from "../../utils/reusables"
import { applyMixins } from "@lincode/utils"
import { scaleDown, scaleUp } from "../../../engine/constants"
import Point3d from "../../../api/Point3d"
import { point2Vec } from "../../utils/vec2Point"
import ISimpleObjectManager from "../../../interface/ISimpleObjectManager"
import PhysicsMixin from "../mixins/PhysicsMixin"
import getCenter from "../../utils/getCenter"
import PositionedItem from "../../../api/core/PositionedItem"
import AnimationMixin from "../mixins/AnimationMixin"
import StaticObjectManager from "../StaticObjectManager"

export const idMap = new Map<string, Set<SimpleObjectManager>>()

class SimpleObjectManager<T extends Object3D = Object3D> extends StaticObjectManager<T> implements ISimpleObjectManager {
    public get width() {
        return this.object3d.scale.x * scaleUp
    }
    public set width(val: number) {
        this.object3d.scale.x = val * scaleDown
    }

    public get height() {
        return this.object3d.scale.y * scaleUp
    }
    public set height(val: number) {
        this.object3d.scale.y = val * scaleDown
    }

    public get depth() {
        return this.object3d.scale.z * scaleUp
    }
    public set depth(val: number) {
        this.object3d.scale.z = val * scaleDown
    }
    
    public override get x() {
        return super.x
    }
    public override set x(val: number) {
        super.x = val
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).x = true)
    }

    public override get y() {
        return super.y
    }
    public override set y(val: number) {
        super.y = val
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).y = true)
    }

    public override get z() {
        return super.z
    }
    public override set z(val: number) {
        super.z = val
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).z = true)
    }

    public get scaleX() {
        return this.outerObject3d.scale.x
    }
    public set scaleX(val: number) {
        this.outerObject3d.scale.x = val
    }

    public get scaleY() {
        return this.outerObject3d.scale.y
    }
    public set scaleY(val: number) {
        this.outerObject3d.scale.y = val
    }

    public get scaleZ() {
        return this.outerObject3d.scale.z
    }
    public set scaleZ(val: number) {
        this.outerObject3d.scale.z = val
    }

    public get scale() {
        return this.scaleX
    }
    public set scale(val: number) {
        this.scaleX = val
        this.scaleY = val
        this.scaleZ = val
    }

    public get rotationX() {
        return this.outerObject3d.rotation.x * rad2Deg
    }
    public set rotationX(val: number) {
        this.outerObject3d.rotation.x = val * deg2Rad
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).x = true)
    }

    protected onRotationY?: () => void
    public get rotationY() {
        return this.outerObject3d.rotation.y * rad2Deg
    }
    public set rotationY(val: number) {
        this.outerObject3d.rotation.y = val * deg2Rad
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).y = true)
        this.onRotationY?.()
    }

    public get rotationZ() {
        return this.outerObject3d.rotation.z * rad2Deg
    }
    public set rotationZ(val: number) {
        this.outerObject3d.rotation.z = val * deg2Rad
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).z = true)
    }

    public get rotation() {
        return this.rotationZ
    }
    public set rotation(val: number) {
        this.rotationZ = val
    }

    public get innerVisible() {
        return this.object3d.visible
    }
    public set innerVisible(val: boolean) {
        this.object3d.visible = val
    }

    public lookAt(target: PositionedItem | Point3d) {
        if ("object3d" in target)
            this.outerObject3d.lookAt((target.object3d ?? target.outerObject3d).getWorldPosition(vector3))
        else
            this.outerObject3d.lookAt(point2Vec(target))

        this.physicsRotate()
        this.onRotationY?.()
    }

    public translateX(val: number) {
        this.outerObject3d.translateX(val * scaleDown)
        this.physicsMove()
    }

    public translateY(val: number) {
        this.outerObject3d.translateY(val * scaleDown)
        this.physicsMove()
    }

    public translateZ(val: number) {
        this.outerObject3d.translateZ(val * scaleDown)
        this.physicsMove()
    }

    public placeAt(object: PositionedItem | { x: number, y: number, z: number }) {
        if ("object3d" in object) {
            this.outerObject3d.position.copy(getCenter(object.object3d ?? object.outerObject3d))
            this.outerObject3d.quaternion.copy(object.outerObject3d.getWorldQuaternion(quaternion))
        }
        else this.outerObject3d.position.copy(point2Vec(object))

        this.physicsMove()
        this.physicsRotate()
        this.onRotationY?.()
    }

    public moveForward(distance: number) {
        if (distance === 0) return

		vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
		vector3.crossVectors(this.outerObject3d.up, vector3)
		this.outerObject3d.position.addScaledVector(vector3, distance * scaleDown)

        this.physicsMoveXZ()
	}

    public moveRight(distance: number) {
        if (distance === 0) return

		vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
		this.outerObject3d.position.addScaledVector(vector3, distance * scaleDown)

        this.physicsMoveXZ()
	}
}
interface SimpleObjectManager<T extends Object3D = Object3D> extends StaticObjectManager<T>, AnimationMixin, PhysicsMixin {}
applyMixins(SimpleObjectManager, [AnimationMixin, PhysicsMixin])
export default SimpleObjectManager