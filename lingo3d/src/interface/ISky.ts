import IEventLoop, { eventLoopDefaults } from "./IEventLoop"

export default interface ISky extends IEventLoop {}

export const skyDefaults: ISky = {
    ...eventLoopDefaults
}