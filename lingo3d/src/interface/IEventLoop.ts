import EventLoopItem from "../api/core/EventLoopItem"
import { ExtractProps } from "./utils/extractProps"

export default interface IEventLoop {
    onLoop?: () => void
    proxy?: EventLoopItem
}

export const eventLoopSchema: Required<ExtractProps<IEventLoop>> = {
    onLoop: Function,
    proxy: Object
}

export const eventLoopDefaults: IEventLoop = {}