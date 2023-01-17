import { forceGet } from "@lincode/utils"

export default class NullableDefault<T> {
    public constructor(public value: T) {}
}

const nullableDefaultMap = new Map<any, NullableDefault<any>>()

export const nullableDefault = <T>(value: T) =>
    forceGet(nullableDefaultMap, value, () => new NullableDefault(value))
