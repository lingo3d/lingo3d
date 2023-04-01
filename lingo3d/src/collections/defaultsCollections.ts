import Defaults from "../interface/utils/Defaults"
import Options from "../interface/utils/Options"

export const defaultsOptionsMap = new WeakMap<Defaults<any>, Options<any>>()
export const defaultsOwnKeysRecordMap = new WeakMap<
    Defaults<any>,
    Partial<Record<string, true>>
>()
