import compileScript from "../../compiler/compileScript"
import { setScriptCompile } from "../../states/useScriptCompile"

export default async (script: string) => {
    setScriptCompile({ raw: script })
    const compiled = await compileScript(script)
    setScriptCompile({ compiled })
}
