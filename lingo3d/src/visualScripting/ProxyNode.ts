import Appendable from "../api/core/Appendable"
import createObject from "../api/serializer/createObject"
import { GameObjectType } from "../api/serializer/types"

const proxyNodeSet = new WeakSet<ProxyNode>()
export const isProxyNode = (val: any): val is ProxyNode => proxyNodeSet.has(val)

export default class ProxyNode extends Appendable {
    public constructor(target?: Appendable) {
        super()
        proxyNodeSet.add(this)
        if (!target) return
        target.dispose()
        Object.setPrototypeOf(this, target)
    }

    public set source(type: GameObjectType) {
        const target = createObject(type)
        target.dispose()
        Object.setPrototypeOf(this, target)
    }
}
