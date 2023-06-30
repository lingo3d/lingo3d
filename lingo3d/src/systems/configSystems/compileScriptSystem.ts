import compileScript from "../../compiler/compileScript"
import Script from "../../display/Script"
import createInternalSystem from "../utils/createInternalSystem"

export const compileScriptSystem = createInternalSystem("compileScriptSystem", {
    effect: (self: Script) => {
        compileScript(self)
    }
})
