import { event } from "@lincode/events"
import SimpleObjectManager from "../display/core/SimpleObjectManager"

export const [emitSceneGraphDoubleClick, onSceneGraphDoubleClick] = event<SimpleObjectManager>()