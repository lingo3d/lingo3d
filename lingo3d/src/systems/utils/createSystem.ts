import { nameSystemMap } from "../../collections/nameSystemMap"
import Appendable from "../../display/core/Appendable"
import createInternalSystem, { SystemOptions } from "./createInternalSystem"

export default <
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
>(
    name: string,
    options: SystemOptions<GameObject, Data>
) => {
    const system = createInternalSystem(name, options, true)
    nameSystemMap.set(name, system)
    return system
}
