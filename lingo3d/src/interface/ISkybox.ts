import IEventLoop, { eventLoopDefaults } from "./IEventLoop"

export default interface ISkybox extends IEventLoop {
    texture?: string | Array<string>
}

export const skyboxDefaults: ISkybox = {
    ...eventLoopDefaults
}