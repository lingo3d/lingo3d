import PhysicsItem from "../display/core/SimpleObjectManager/PhysicsItem"
import IAnimation from "./IAnimation"

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

    noTumble?: boolean
    slippery?: boolean
    mass?: number
    physicsGroup?: PhysicsGroupIndex
    ignorePhysicsGroups?: Array<PhysicsGroupIndex>
    physics: PhysicsOptions
    physicsShape: PhysicsShape
}