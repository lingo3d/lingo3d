import PhysicsItem from "../display/core/SimpleObjectManager/PhysicsItem"
import cubeShape from "../display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/cubeShape"
import IAnimation, { animationDefaults } from "./IAnimation"

export type PhysicsGroupIndex = 0 | 1 | 2 | 3 | 4 | 5
export type PhysicsOptions = boolean | "2d" | "map" | "map-debug" | "character"
export type PhysicsShape = (this: PhysicsItem) => Promise<void>

export default interface IPhysics extends IAnimation {
    maxAngularVelocityX: number
    maxAngularVelocityY: number
    maxAngularVelocityZ: number

    maxVelocityX: number
    maxVelocityY: number
    maxVelocityZ: number

    velocity: { x: number, y: number, z: number }

    noTumble?: boolean
    slippery?: boolean
    mass?: number
    physicsGroup?: PhysicsGroupIndex
    ignorePhysicsGroups?: Array<PhysicsGroupIndex>
    physics: PhysicsOptions
    physicsShape: PhysicsShape
}

export const physicsDefaults: IPhysics = {
    ...animationDefaults,

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