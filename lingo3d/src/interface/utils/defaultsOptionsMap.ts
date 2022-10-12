import { forceGet } from "@lincode/utils"
import Defaults from "./Defaults"
import Options from "./Options"

const defaultsOptionsMap = new WeakMap<Defaults<any>, Options<any>>()
export default defaultsOptionsMap

export const inheritOptions = <T>(
    defaults: Defaults<T>,
    parentDefaults: Defaults<T>
) =>
    Object.assign(
        forceGet(defaultsOptionsMap, defaults, () => ({})),
        defaultsOptionsMap.get(parentDefaults)
    )
