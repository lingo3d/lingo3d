import MeshManager from "../display/core/MeshManager"
import IPositioned, {
    positionedDefaults,
    positionedSchema
} from "./IPositioned"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IArticulationJoint extends IPositioned {
    jointChild: Nullable<string | MeshManager>
    jointParent: Nullable<string | MeshManager>
}

export const articulationJointSchema: Required<
    ExtractProps<IArticulationJoint>
> = {
    ...positionedSchema,
    jointChild: [String, Object],
    jointParent: [String, Object]
}

export const articulationJointDefaults = extendDefaults<IArticulationJoint>(
    [positionedDefaults],
    {
        jointChild: undefined,
        jointParent: undefined
    }
)
