import { forceGet } from "@lincode/utils"

export const defaultMethodVoidArg = {} as any

export const defaultMethodArgs = new Set<any>()

export default class DefaultMethod<T> {
    public constructor(public arg: T = defaultMethodVoidArg) {
        defaultMethodArgs.add(arg)
    }
}

const defaultMethodMap = new Map<any, DefaultMethod<any>>()
export const defaultMethod = <T>(value: T): DefaultMethod<T> =>
    forceGet(defaultMethodMap, value, () => new DefaultMethod(value))
