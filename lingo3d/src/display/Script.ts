import { scriptUUIDSystemNamesMap } from "../collections/scriptUUIDSystemNamesMap"
import { userlandNameSystemMap } from "../collections/userlandNameSystemMap"
import IScript, {
    ScriptLanguage,
    ScriptMode,
    scriptDefaults,
    scriptSchema
} from "../interface/IScript"
import { compileScriptSystem } from "../systems/configSystems/compileScriptSystem"
import Appendable from "./core/Appendable"

export default class Script extends Appendable implements IScript {
    public static componentName = "script"
    public static defaults = scriptDefaults
    public static schema = scriptSchema

    private _code = ""
    public get code() {
        return this._code
    }
    public set code(val) {
        this._code = val
        compileScriptSystem.add(this)
    }

    private _language: ScriptLanguage = "TypeScript"
    public get language() {
        return this._language
    }
    public set language(val) {
        this._language = val
        compileScriptSystem.add(this)
    }

    private _mode: ScriptMode = "script"
    public get mode() {
        return this._mode
    }
    public set mode(val) {
        this._mode = val
        compileScriptSystem.add(this)
    }

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
