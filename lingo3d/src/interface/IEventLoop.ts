import EventLoopItem from "../api/core/EventLoopItem"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"

export default interface IEventLoop {
    onLoop?: () => void
    proxy?: EventLoopItem
}

export const eventLoopSchema: Required<ExtractProps<IEventLoop>> = {
    onLoop: Function,
    proxy: Object
}

hideSchema(["proxy"])

export const eventLoopDefaults: IEventLoop = {}