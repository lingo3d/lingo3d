import { ExtractProps } from "./utils/extractProps"

export default interface IEventLoop {
    onLoop?: () => void
}

export const eventLoopSchema: Required<ExtractProps<IEventLoop>> = {
    onLoop: Function
}

export const eventLoopDefaults: IEventLoop = {}