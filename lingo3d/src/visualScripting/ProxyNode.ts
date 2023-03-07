import Appendable from "../api/core/Appendable"

export const proxyNodeSet = new WeakSet<ProxyNode>()

export default class ProxyNode extends Appendable {
    public constructor(target: Appendable) {
        super()
        Object.setPrototypeOf(this, target)
        proxyNodeSet.add(this)
    }
}
