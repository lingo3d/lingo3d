import Appendable from "../api/core/Appendable"
import Connector from "../visualScripting/Connector"

export const managerConnectorsMap = new WeakMap<Appendable, Set<Connector>>()
