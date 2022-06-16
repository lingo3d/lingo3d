import { Point3d } from "@lincode/math"
import PhysicsMixin from "../display/core/mixins/PhysicsMixin"
import cubeShape from "../display/core/mixins/PhysicsMixin/cannon/shapes/cubeShape"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"

export type PhysicsGroupIndex = 0 | 1 | 2 | 3 | 4 | 5
export type PhysicsOptions = boolean | "2d" | "map" | "map-debug" | "character"
export type PhysicsShape = (this: PhysicsMixin) => Promise<void>

export default interface IPhysics {
    maxAngularVelocityX: number
    maxAngularVelocityY: number
    maxAngularVelocityZ: number

    maxVelocityX: number
    maxVelocityY: number
    maxVelocityZ: number

    velocity: Point3d

    noTumble: Nullable<boolean>
    slippery: Nullable<boolean>
    mass: Nullable<number>
    physicsGroup: Nullable<PhysicsGroupIndex>
    ignorePhysicsGroups: Nullable<Array<PhysicsGroupIndex>>

    physics: PhysicsOptions
    physicsShape: PhysicsShape
}

export const physicsSchema: Required<ExtractProps<IPhysics>> = {
    maxAngularVelocityX: Number,
    maxAngularVelocityY: Number,
    maxAngularVelocityZ: Number,

    maxVelocityX: Number,
    maxVelocityY: Number,
    maxVelocityZ: Number,

    velocity: Object,

    noTumble: Boolean,
    slippery: Boolean,
    mass: Number,
    physicsGroup: Number,
    ignorePhysicsGroups: Array,

    physics: [String, Boolean],
    physicsShape: Function
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
    "ignorePhysicsGroups",
    "physicsShape"
])

export const physicsDefaults: Defaults<IPhysics> = {
    maxAngularVelocityX: Infinity,
    maxAngularVelocityY: Infinity,
    maxAngularVelocityZ: Infinity,

    maxVelocityX: Infinity,
    maxVelocityY: Infinity,
    maxVelocityZ: Infinity,

    velocity: { x: 0, y: 0, z: 0 },

    noTumble: [undefined, false],
    slippery: [undefined, false],
    mass: [undefined, 1],
    physicsGroup: undefined,
    ignorePhysicsGroups: undefined,

    physics: false,
    physicsShape: cubeShape
}