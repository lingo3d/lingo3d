import { forceGetInstance } from "@lincode/utils"

export default class NullableDefault<T> {
    public constructor(public value: T) {}
}

const nullableDefaultMap = new Map<any, NullableDefault<any>>()
export const nullableDefault = <T>(value: T) =>
    forceGetInstance(nullableDefaultMap, value, NullableDefault, [
        Object.freeze(value)
    ])
