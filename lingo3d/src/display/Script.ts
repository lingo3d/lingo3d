import { scriptUUIDSystemNamesMap } from "../collections/scriptUUIDSystemNamesMap"
import { userlandNameSystemMap } from "../collections/userlandNameSystemMap"
import IScript, {
    ScriptLanguage,
    ScriptType,
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
    public type: ScriptType = "script"

    protected override disposeNode() {
        super.disposeNode()
        if (!scriptUUIDSystemNamesMap.has(this.uuid)) return
        for (const name of scriptUUIDSystemNamesMap.get(this.uuid)!) {
            userlandNameSystemMap.get(name)!.dispose()
            userlandNameSystemMap.delete(name)
        }
        scriptUUIDSystemNamesMap.delete(this.uuid)
    }
}
