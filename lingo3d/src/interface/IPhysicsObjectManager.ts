import { Point3d } from "@lincode/math"
import ISimpleObjectManager, {
    simpleObjectManagerDefaults,
    simpleObjectManagerSchema
} from "./ISimpleObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"
import { extendDefaults } from "./utils/Defaults"

export type PhysicsGroupIndex = 0 | 1 | 2 | 3 | 4 | 5
export type PhysicsOptions = boolean | "2d" | "map" | "map-debug" | "character"

export default interface IPhysicsObjectManager extends ISimpleObjectManager {
    maxAngularVelocityX: number
    maxAngularVelocityY: number
    maxAngularVelocityZ: number

    maxVelocityX: number
    maxVelocityY: number
    maxVelocityZ: number

    velocity: Point3d
    gravity: boolean

    noTumble: Nullable<boolean>
    slippery: Nullable<boolean>
    mass: Nullable<number>
    physicsGroup: Nullable<PhysicsGroupIndex>
    ignorePhysicsGroups: Nullable<Array<PhysicsGroupIndex>>

    physics: PhysicsOptions
}

export const physicsObjectManagerSchema: Required<
    ExtractProps<IPhysicsObjectManager>
> = {
    ...simpleObjectManagerSchema,

    maxAngularVelocityX: Number,
    maxAngularVelocityY: Number,
    maxAngularVelocityZ: Number,

    maxVelocityX: Number,
    maxVelocityY: Number,
    maxVelocityZ: Number,

    velocity: Object,
    gravity: Boolean,

    noTumble: Boolean,
    slippery: Boolean,
    mass: Number,
    physicsGroup: Number,
    ignorePhysicsGroups: Array,

    physics: [String, Boolean]
}
hideSchema([
    "maxAngularVelocityX",
    "maxAngularVelocityY",
    "maxAngularVelocityZ",
    "maxVelocityX",
    "maxVelocityY",
    "maxVelocityZ",
    "velocity",
    "noTumble",
    "slippery",
    "mass",
    "physicsGroup",
    "ignorePhysicsGroups"
])

export const physicsObjectManagerDefaults =
    extendDefaults<IPhysicsObjectManager>([simpleObjectManagerDefaults], {
        maxAngularVelocityX: Infinity,
        maxAngularVelocityY: Infinity,
        maxAngularVelocityZ: Infinity,

        maxVelocityX: Infinity,
        maxVelocityY: Infinity,
        maxVelocityZ: Infinity,

        velocity: { x: 0, y: 0, z: 0 },
        gravity: true,

        noTumble: new NullableDefault(false),
        slippery: new NullableDefault(false),
        mass: new NullableDefault(1),
        physicsGroup: undefined,
        ignorePhysicsGroups: undefined,

        physics: false
    })
