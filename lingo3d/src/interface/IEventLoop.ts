export default interface IEventLoop {
    onLoop?: () => void
}

export const eventLoopDefaults: IEventLoop = {}