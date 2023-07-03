import { DefaultMethodArg } from "../interface/utils/DefaultMethod"
import { Point3dType } from "./isPoint"

export type DefaultMethodArgType = Point3dType | DefaultMethodArg

export const defaultMethodArgs = new WeakSet<DefaultMethodArgType>()
export const isDefaultMethodArg = (val: any): val is DefaultMethodArgType =>
    val && defaultMethodArgs.has(val)
