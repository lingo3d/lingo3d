import { Point3d } from "@lincode/math"
import { forceGet } from "@lincode/utils"
import { nanoid } from "nanoid"

//mark
export class DefaultMethodArg {
    public constructor(public value: string | number | boolean = nanoid()) {
        Object.freeze(this)
    }
}

type DefaultMethodArgType = Point3d | DefaultMethodArg

export const defaultMethodVoidArg = new DefaultMethodArg()
export const defaultMethodNumberArg = new DefaultMethodArg(0)
export const defaultMethodPt3dArg = Object.freeze(new Point3d(0, 0, 0))

const defaultMethodArgs = new Set<DefaultMethodArgType>()
export const isDefaultMethodArg = (value: any): value is DefaultMethodArgType =>
    defaultMethodArgs.has(value)

export default class DefaultMethod {
    public constructor(public arg: DefaultMethodArgType) {
        defaultMethodArgs.add(arg)
    }
}

const defaultMethodMap = new Map<DefaultMethodArgType, DefaultMethod>()
export const defaultMethod = (
    value: DefaultMethodArgType = defaultMethodVoidArg
) => forceGet(defaultMethodMap, value, () => new DefaultMethod(value))
