import { Point3d } from "@lincode/math"
import PhysicsMixin from "../display/core/mixins/PhysicsMixin"
import cubeShape from "../display/core/mixins/PhysicsMixin/cannon/shapes/cubeShape"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"

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

    noTumble?: boolean
    slippery?: boolean
    mass?: number
    physicsGroup?: PhysicsGroupIndex
    ignorePhysicsGroups?: Array<PhysicsGroupIndex>

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
    "noTumble",
    "slippery",
    "mass",
    "physicsGroup",
    "ignorePhysicsGroups",
    "physicsShape"
])

export const physicsDefaults: IPhysics = {
    maxAngularVelocityX: Infinity,
    maxAngularVelocityY: Infinity,
    maxAngularVelocityZ: Infinity,

    maxVelocityX: Infinity,
    maxVelocityY: Infinity,
    maxVelocityZ: Infinity,

    velocity: { x: 0, y: 0, z: 0 },

    physics: false,
    physicsShape: cubeShape
}