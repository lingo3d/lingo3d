import Defaults from "./Defaults"
import Options from "./Options"

const defaultsOptionsMap = new WeakMap<Defaults<any>, Options<any>>()
export default defaultsOptionsMap

export const inheritOptions = <T>(
    defaults: Defaults<T>,
    parentDefaults: Defaults<T>
) => defaultsOptionsMap.set(defaults, defaultsOptionsMap.get(parentDefaults)!)
