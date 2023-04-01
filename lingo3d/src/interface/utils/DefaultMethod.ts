import { Point3d } from "@lincode/math"
import { forceGet } from "@lincode/utils"
import { INVERSE_STANDARD_FRAME } from "../../globals"
import {
    isDefaultMethodArg,
    defaultMethodArgs
} from "../../collections/typeGuards"

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
export const defaultMethodDtArg = new DefaultMethodArg(
    INVERSE_STANDARD_FRAME,
    false
)
export const defaultMethodPt3dArg = Object.freeze(new Point3d(0, 0, 0))

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
