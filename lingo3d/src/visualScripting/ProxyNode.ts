import Appendable from "../api/core/Appendable"
import getStaticProperties from "../display/utils/getStaticProperties"

export default class ProxyNode extends Appendable {
    public static componentName = "proxyNode"

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
