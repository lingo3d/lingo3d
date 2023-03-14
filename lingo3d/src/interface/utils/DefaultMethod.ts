import { Point3d } from "@lincode/math"
import { forceGet } from "@lincode/utils"

export class DefaultMethodArg {
    public constructor(
        public value?: string | number | boolean,
        public allowInput = true
    ) {
        Object.freeze(this)
    }
}

export type DefaultMethodArgType = Point3d | DefaultMethodArg

export const defaultMethodVoidArg = new DefaultMethodArg()
export const defaultMethodNumberArg = new DefaultMethodArg(0)
export const defaultMethodDtArg = new DefaultMethodArg(1, false)
export const defaultMethodPt3dArg = Object.freeze(new Point3d(0, 0, 0))

export const defaultMethodArgs = new WeakSet<DefaultMethodArgType>()
export const isDefaultMethodArg = (value: any): value is DefaultMethodArgType =>
    defaultMethodArgs.has(value)

export const isDefaultMethodArgInstance = (
    value: any
): value is DefaultMethodArg => isDefaultMethodArg(value) && "value" in value

export default class DefaultMethod {
    public constructor(public arg: DefaultMethodArgType) {
        defaultMethodArgs.add(arg)
    }
}

const defaultMethodMap = new Map<DefaultMethodArgType, DefaultMethod>()
export const defaultMethod = (
    value: DefaultMethodArgType = defaultMethodVoidArg
) => forceGet(defaultMethodMap, value, () => new DefaultMethod(value))
