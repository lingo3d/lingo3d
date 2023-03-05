import { Point3d } from "@lincode/math"
import { forceGet } from "@lincode/utils"
import DefaultValue from "./DefaultValue"

type DefaultMethodArg = Point3d | DefaultValue

export const defaultMethodVoidArg = new DefaultValue()
export const defaultMethodNumberArg = new DefaultValue(0)
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
