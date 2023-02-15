import { forceGet } from "@lincode/utils"

export default class DefaultMethod<T> {
    public constructor(public arg: T) {}
}

const defaultMethodMap = new Map<any, DefaultMethod<any>>()
export const defaultMethod = <T>(value: T): DefaultMethod<T> =>
    forceGet(defaultMethodMap, value, () => new DefaultMethod(value))
