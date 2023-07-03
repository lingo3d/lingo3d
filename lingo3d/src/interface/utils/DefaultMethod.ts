import { forceGetInstance } from "@lincode/utils"
import { INVERSE_STANDARD_FRAME } from "../../globals"
import Point3d from "../../math/Point3d"
import {
    DefaultMethodArgType,
    defaultMethodArgs
} from "../../typeGuards/isDefaultMethodArg"

export class DefaultMethodArg {
    public constructor(
        public value?: string | number | boolean,
        public allowInput = true
    ) {
        Object.freeze(this)
    }
}

export const defaultMethodVoidArg = new DefaultMethodArg()
export const defaultMethodNumberArg = new DefaultMethodArg(0)
export const defaultMethodDtArg = new DefaultMethodArg(
    INVERSE_STANDARD_FRAME,
    false
)
export const defaultMethodPt3dArg = Object.freeze(new Point3d(0, 0, 0))

export default class DefaultMethod {
    public constructor(public arg: DefaultMethodArgType) {
        defaultMethodArgs.add(arg)
    }
}

const defaultMethodMap = new Map<DefaultMethodArgType, DefaultMethod>()
export const defaultMethod = (
    value: DefaultMethodArgType = defaultMethodVoidArg
) => forceGetInstance(defaultMethodMap, value, DefaultMethod, [value])
