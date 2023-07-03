import { DefaultMethodArg } from "../interface/utils/DefaultMethod"
import { isDefaultMethodArg } from "./isDefaultMethodArg"

export const isDefaultMethodArgInstance = (
    value: any
): value is DefaultMethodArg => isDefaultMethodArg(value) && "value" in value
