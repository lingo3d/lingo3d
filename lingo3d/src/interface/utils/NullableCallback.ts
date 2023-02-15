import { forceGet } from "@lincode/utils"
import { nanoid } from "nanoid"
import MeshAppendable from "../../api/core/MeshAppendable"

export const nullableCallbackVoidParam = nanoid() as any
export const nullableCallbackMeshAppendableParam =
    nanoid() as any as MeshAppendable

export default class NullableCallback<T> {
    public constructor(public param: T = nullableCallbackVoidParam) {}
}

const nullableCallbackMap = new Map<any, NullableCallback<any>>()

export const nullableCallback = <T>(value: T): NullableCallback<T> =>
    forceGet(nullableCallbackMap, value, () => new NullableCallback(value))
