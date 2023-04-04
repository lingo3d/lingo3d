import { Object3D } from "three"
import ISimpleObjectManager from "../../interface/ISimpleObjectManager"
import AnimatedObjectManager from "./AnimatedObjectManager"
import scene from "../../engine/scene"
import { addUpdatePhysicsSystem } from "../../systems/configSystems/updatePhysicsSystem"
import { pxUpdateShapeSet } from "../../collections/pxCollections"

export default class SimpleObjectManager<T extends Object3D = Object3D>
    extends AnimatedObjectManager<T>
    implements ISimpleObjectManager
{
    public constructor(object3d = new Object3D() as T, unmounted?: boolean) {
        super(object3d)
        !unmounted && scene.add(object3d)
    }

    public get scaleX() {
        return this.outerObject3d.scale.x
    }
    public set scaleX(val) {
        this.outerObject3d.scale.x = val
        pxUpdateShapeSet.add(this)
        addUpdatePhysicsSystem(this)
    }

    public get scaleY() {
        return this.outerObject3d.scale.y
    }
    public set scaleY(val) {
        this.outerObject3d.scale.y = val
        pxUpdateShapeSet.add(this)
        addUpdatePhysicsSystem(this)
    }

    public get scaleZ() {
        return this.outerObject3d.scale.z
    }
    public set scaleZ(val) {
        this.outerObject3d.scale.z = val
        pxUpdateShapeSet.add(this)
        addUpdatePhysicsSystem(this)
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
