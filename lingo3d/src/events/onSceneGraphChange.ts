import { event } from "@lincode/events"
import { onBeforeRender } from "./onBeforeRender"
import { sceneGraphChangePtr } from "../pointers/sceneGraphChangePtr"

const [emitSceneGraphChange, onSceneGraphChange] = event()
export { onSceneGraphChange }

onBeforeRender(() => {
    if (!sceneGraphChangePtr[0]) return
    sceneGraphChangePtr[0] = false
    emitSceneGraphChange()
})
