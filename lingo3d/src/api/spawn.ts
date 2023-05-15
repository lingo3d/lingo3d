import Appendable from "../display/core/Appendable"
import deserialize from "./serializer/deserialize"
import { serializeAppendable } from "./serializer/serialize"

export default (target: Appendable) =>
    deserialize([serializeAppendable(target)])[0]!
