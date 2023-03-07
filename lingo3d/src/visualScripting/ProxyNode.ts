import Appendable from "../api/core/Appendable"
import getStaticProperties from "../display/utils/getStaticProperties"
import { proxyNodeDefaults, proxyNodeSchema } from "../interface/IProxyNode"

export default class ProxyNode extends Appendable {
    public static componentName = "proxyNode"
    public static defaults = proxyNodeDefaults
    public static schema = proxyNodeSchema

    public constructor(target: Appendable) {
        super()
        const properties = getStaticProperties(target)
        this.runtimeIncludeKeys = new Set([
            ...(properties.includeKeys ?? []),
            ...(target.runtimeIncludeKeys ?? [])
        ])
        this.runtimeSchema = properties.schema
        this.runtimeDefaults = properties.defaults
        this.runtimeData = target
    }
}
