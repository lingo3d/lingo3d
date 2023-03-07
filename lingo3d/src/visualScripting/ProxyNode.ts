import Appendable from "../api/core/Appendable"
import getStaticProperties from "../display/utils/getStaticProperties"

export default class ProxyNode extends Appendable {
    public constructor(target: Appendable) {
        super()
        Object.setPrototypeOf(this, target)
        console.log(getStaticProperties(this))
    }
}
