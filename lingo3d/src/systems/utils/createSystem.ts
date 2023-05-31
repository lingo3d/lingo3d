import Appendable from "../../display/core/Appendable"
import createInternalSystem, { SystemOptions } from "./createInternalSystem"

export default <
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
>(
    name: string,
    options: SystemOptions<GameObject, Data>
) => createInternalSystem(name, options, true)