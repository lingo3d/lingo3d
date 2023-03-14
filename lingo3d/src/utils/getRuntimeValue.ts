import DefaultMethod from "../interface/utils/DefaultMethod"

export const getRuntimeValue = (target: any, key: string) => {
    if (target.runtimeData && key in target.runtimeData)
        return target.runtimeData[key]
    return target[key]
}

export const setRuntimeValue = (
    target: any,
    defaults: any,
    key: string,
    value: any
) => {
    if (target.runtimeData && key in target.runtimeData) {
        target.runtimeData[key] = value
        return
    }
    if (defaults[key] instanceof DefaultMethod) {
        target[key](value)
        return
    }
    target[key] = value
}
