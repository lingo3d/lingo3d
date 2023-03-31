import { Object3D } from "three"
import ISimpleObjectManager from "../../interface/ISimpleObjectManager"
import { applyMixins } from "@lincode/utils"
import AnimatedObjectManager from "./AnimatedObjectManager"
import PositionedMixin from "./mixins/PositionedMixin"
import DirectionedMixin from "./mixins/DirectionedMixin"
import MixinType from "./mixins/utils/MixinType"
import scene from "../../engine/scene"
import { addTransformChangedSystem } from "../../systems/configSystems/transformChangedSystem"

class SimpleObjectManager<T extends Object3D = Object3D>
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
        this.userData.updatePhysicsShape = true
        addTransformChangedSystem(this)
    }

    public get scaleY() {
        return this.outerObject3d.scale.y
    }
    public set scaleY(val) {
        this.outerObject3d.scale.y = val
        this.userData.updatePhysicsShape = true
        addTransformChangedSystem(this)
    }

    public get scaleZ() {
        return this.outerObject3d.scale.z
    }
    public set scaleZ(val) {
        this.outerObject3d.scale.z = val
        this.userData.updatePhysicsShape = true
        addTransformChangedSystem(this)
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
interface SimpleObjectManager<T extends Object3D = Object3D>
    extends AnimatedObjectManager<T>,
        MixinType<PositionedMixin<T>>,
        MixinType<DirectionedMixin<T>> {}
applyMixins(SimpleObjectManager, [DirectionedMixin, PositionedMixin])
export default SimpleObjectManager
