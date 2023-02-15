import { forceGet } from "@lincode/utils"
import { nanoid } from "nanoid"

export const nullableCallbackVoidParam: any = nanoid()

export default class NullableCallback<T> {
    public constructor(public param: T = nullableCallbackVoidParam) {}
}

const nullableCallbackMap = new Map<any, NullableCallback<any>>()

export const nullableCallback = <T>(value: T): NullableCallback<T> =>
    forceGet(nullableCallbackMap, value, () => new NullableCallback(value))
