import { forceGet } from "@lincode/utils"

export const defaultMethodVoidParam = {} as any

export const defaultMethodParams = new Set<any>()

export default class DefaultMethod<T> {
    public constructor(public arg: T = defaultMethodVoidParam) {
        defaultMethodParams.add(arg)
    }
}

const defaultMethodMap = new Map<any, DefaultMethod<any>>()
export const defaultMethod = <T>(value: T): DefaultMethod<T> =>
    forceGet(defaultMethodMap, value, () => new DefaultMethod(value))
