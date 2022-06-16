import EventLoopItem from "../api/core/EventLoopItem"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"

export default interface IEventLoop {
    onLoop: Nullable<() => void>
    proxy: Nullable<EventLoopItem>
}

export const eventLoopSchema: Required<ExtractProps<IEventLoop>> = {
    onLoop: Function,
    proxy: Object
}

hideSchema(["proxy"])

export const eventLoopDefaults: IEventLoop = {
    onLoop: undefined,
    proxy: undefined
}

export const eventLoopRequiredDefaults: IEventLoop = {
    ...eventLoopDefaults,
    onLoop: fn
}