import Appendable from "../api/core/Appendable"
import { constructorMap } from "../display/utils/getStaticProperties"

export default class ProxyNode extends Appendable {
    public static componentName = "proxyNode"

    public constructor(target: Appendable) {
        super()
        this.runtimeIncludeKeys = target.runtimeIncludeKeys
        this.runtimeSchema = target.runtimeSchema
        this.runtimeDefaults = target.runtimeDefaults
        this.runtimeData = target.runtimeData
        constructorMap.set(this, target.constructor)
    }
}
