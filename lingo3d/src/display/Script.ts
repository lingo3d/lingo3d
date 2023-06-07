import { scriptUUIDSystemNamesMap } from "../collections/scriptUUIDSystemNamesMap"
import { systemsMap } from "../collections/systemsMap"
import { USE_EDITOR_SYSTEMS } from "../globals"
import IScript, {
    ScriptLanguage,
    scriptDefaults,
    scriptSchema
} from "../interface/IScript"
import Appendable from "./core/Appendable"

export default class Script extends Appendable implements IScript {
    public static componentName = "script"
    public static defaults = scriptDefaults
    public static schema = scriptSchema

    public code = ""
    public language: ScriptLanguage = "TypeScript"

    protected override disposeNode() {
        super.disposeNode()
        if (USE_EDITOR_SYSTEMS && scriptUUIDSystemNamesMap.has(this.uuid))
            for (const name of scriptUUIDSystemNamesMap.get(this.uuid)!) {
                systemsMap.get(name)!.dispose()
                systemsMap.delete(name)
            }
        scriptUUIDSystemNamesMap.delete(this.uuid)
    }
}
