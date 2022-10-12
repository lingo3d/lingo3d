import IPhysicsObjectManager, {
    physicsObjectManagerDefaults,
    physicsObjectManagerSchema
} from "./IPhysicsObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"

export default interface IObjectManager extends IPhysicsObjectManager {
    innerRotationX: number
    innerRotationY: number
    innerRotationZ: number
    innerRotation: number

    innerX: number
    innerY: number
    innerZ: number

    width: number
    height: number
    depth: number

    innerVisible: boolean
}

export const objectManagerSchema: Required<ExtractProps<IObjectManager>> = {
    ...physicsObjectManagerSchema,

    innerRotationX: Number,
    innerRotationY: Number,
    innerRotationZ: Number,
    innerRotation: Number,

    innerX: Number,
    innerY: Number,
    innerZ: Number,

    width: Number,
    height: Number,
    depth: Number,

    innerVisible: Boolean
}
hideSchema(["innerRotation", "innerVisible"])

export const objectManagerDefaults: Defaults<IObjectManager> = {
    ...physicsObjectManagerDefaults,

    innerRotationX: 0,
    innerRotationY: 0,
    innerRotationZ: 0,
    innerRotation: 0,

    innerX: 0,
    innerY: 0,
    innerZ: 0,

    width: 100,
    height: 100,
    depth: 100,

    innerVisible: true
}
