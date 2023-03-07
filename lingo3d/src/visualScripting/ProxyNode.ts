import Appendable from "../api/core/Appendable"
import { proxyNodeDefaults, proxyNodeSchema } from "../interface/IProxyNode"
import unsafeGetValue from "../utils/unsafeGetValue"

export default class ProxyNode extends Appendable {
    public static componentName = "proxyNode"
    public static defaults = proxyNodeDefaults
    public static schema = proxyNodeSchema

    public constructor(target: Appendable) {
        super()
        this.runtimeIncludeKeys = new Set([
            ...(unsafeGetValue(target.constructor, "includeKeys") ?? []),
            ...(target.runtimeIncludeKeys ?? [])
        ])
        this.runtimeSchema = unsafeGetValue(target.constructor, "schema")
        this.runtimeDefaults = unsafeGetValue(target.constructor, "defaults")
        this.runtimeData = target
    }
}
