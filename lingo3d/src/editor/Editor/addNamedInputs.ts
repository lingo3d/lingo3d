import { Pane } from "tweakpane"
import { emitSceneGraphNameChange } from "../../events/onSceneGraphNameChange"
import addInputs from "./addInputs"

export default (
    pane: Pane,
    title: string,
    target: Record<string, any>,
    params = { ...target }
) => {
    const result = addInputs(pane, title, target, params)
    result.name.on("change", () => emitSceneGraphNameChange())
    return result
}