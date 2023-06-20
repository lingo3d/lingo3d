import { systemsMap } from "../../collections/systemsMap"
import Appendable from "../../display/core/Appendable"
import createInternalSystem, { SystemOptions } from "./createInternalSystem"

export default <
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void,
    EventData extends
        | Record<string, any>
        | string
        | boolean
        | number
        | Array<any>
        | Function
        | void
>(
    name: string,
    options: SystemOptions<GameObject, Data, EventData>
) => {
    const system = createInternalSystem(name, options)
    systemsMap.set(name, system)
    return system
}
