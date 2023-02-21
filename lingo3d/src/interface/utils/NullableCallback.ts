import { forceGet } from "@lincode/utils"
import { nanoid } from "nanoid"
import { HitEvent } from "../IVisible"

export const nullableCallbackVoidParam = nanoid() as any
export const nullableCallbackHitEventParam = nanoid() as any as HitEvent

export const nullableCallbackParams = new Set<any>()

export default class NullableCallback<T> {
    public constructor(public param: T = nullableCallbackVoidParam) {
        nullableCallbackParams.add(param)
    }
}

const nullableCallbackMap = new Map<any, NullableCallback<any>>()
export const nullableCallback = <T>(value: T): NullableCallback<T> =>
    forceGet(nullableCallbackMap, value, () => new NullableCallback(value))
