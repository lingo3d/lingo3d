import EventLoopItem from "../api/core/EventLoopItem"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
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

export const eventLoopDefaults: Defaults<IEventLoop> = {
    onLoop: undefined,
    proxy: undefined
}