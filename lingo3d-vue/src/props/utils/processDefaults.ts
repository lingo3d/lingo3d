import { forceGet } from "@lincode/utils"
import DefaultMethod from "lingo3d/lib/interface/utils/DefaultMethod"
import getDefaultValue, {
  FunctionPtr
} from "lingo3d/lib/interface/utils/getDefaultValue"

const cache = new WeakMap<Record<string, any>, Record<string, any>>()
const processed = new WeakSet<Record<string, any>>()

export const fn = () => {}

export default (defaults: Record<string, any>) => {
  if (processed.has(defaults)) return defaults

  return forceGet(cache, defaults, () => {
    const result = Object.fromEntries(
      Object.keys(defaults).map((key) => {
        const functionPtr: FunctionPtr = [undefined]
        const val = getDefaultValue(defaults, key, false, false, functionPtr)
        return [key, functionPtr[0] instanceof DefaultMethod ? fn : val]
      })
    )
    processed.add(result)
    return result
  })
}
