import { Point3d } from "@lincode/math"
import { forceGet } from "@lincode/utils"

type DefaultMethodArg =
    | Point3d
    | { value: string | number | boolean | undefined }

export const defaultMethodVoidArg: DefaultMethodArg = Object.freeze({
    value: undefined
})
export const defaultMethodNumberArg = Object.freeze({ value: 0 })
export const defaultMethodPt3dArg = Object.freeze(new Point3d(0, 0, 0))

const defaultMethodArgs = new Set<DefaultMethodArg>()
export const isDefaultMethodArg = (value: any): value is DefaultMethodArg =>
    defaultMethodArgs.has(value)

export default class DefaultMethod {
    public constructor(public arg: DefaultMethodArg) {
        defaultMethodArgs.add(arg)
    }
}

const defaultMethodMap = new Map<DefaultMethodArg, DefaultMethod>()
export const defaultMethod = (value: DefaultMethodArg = defaultMethodVoidArg) =>
    forceGet(defaultMethodMap, value, () => new DefaultMethod(value))
