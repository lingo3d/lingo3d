import { nanoid } from "nanoid"

export const nullableCallbackVoidParam: any = nanoid()

export default class NullableCallback<T> {
    public constructor(public param: T = nullableCallbackVoidParam) {}
}
