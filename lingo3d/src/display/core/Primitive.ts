import { applyMixins } from "@lincode/utils"
import { Mesh, BufferGeometry } from "three"
import TexturedStandardMixin, {
    StandardMesh
} from "./mixins/TexturedStandardMixin"
import IPrimitive, {
    primitiveDefaults,
    primitiveSchema
} from "../../interface/IPrimitive"
import { standardMaterial } from "../utils/reusables"
import VisibleObjectManager from "./VisibleObjectManager"
import cookConvexGeometry, {
    decreaseConvexGeometryCount
} from "./PhysicsObjectManager/physx/cookConvexGeometry"
import { PhysicsOptions } from "../../interface/IPhysicsObjectManager"
import { physXPtr } from "../../states/usePhysX"

abstract class Primitive
    extends VisibleObjectManager<StandardMesh>
    implements IPrimitive
{
    public static defaults = primitiveDefaults
    public static schema = primitiveSchema

    public convexParamString?: string
    protected override _dispose() {
        super._dispose()
        decreaseConvexGeometryCount(this)
    }

    public override getPxShape(_: PhysicsOptions, actor: any) {
        const { material, shapeFlags, PxRigidActorExt, pxFilterData } =
            physXPtr[0]

        const shape = PxRigidActorExt.prototype.createExclusiveShape(
            actor,
            cookConvexGeometry(this.componentName, this),
            material,
            shapeFlags
        )
        shape.setSimulationFilterData(pxFilterData)
        return shape
    }

    public constructor(geometry: BufferGeometry) {
        const mesh = new Mesh(geometry, standardMaterial)
        mesh.castShadow = true
        mesh.receiveShadow = true
        super(mesh)
    }
}
interface Primitive
    extends VisibleObjectManager<StandardMesh>,
        TexturedStandardMixin {}
applyMixins(Primitive, [TexturedStandardMixin])
export default Primitive
