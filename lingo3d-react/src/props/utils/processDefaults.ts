import { forceGet } from "@lincode/utils"
import getDefaultValue from "lingo3d/lib/interface/utils/getDefaultValue"

const cache = new WeakMap<Record<string, any>, Record<string, any>>()
const processed = new WeakSet<Record<string, any>>()

export const fn = () => {}

export default (defaults: Record<string, any>) => {
  if (processed.has(defaults)) return defaults

  return forceGet(cache, defaults, () => {
    const result = Object.fromEntries(
      Object.keys(defaults).map((key) => {
        const isFunctionPtr: ["method" | "callback" | ""] = [""]
        const val = getDefaultValue(defaults, key, false, false, isFunctionPtr)
        return [key, isFunctionPtr[0] === "method" ? fn : val]
      })
    )
    processed.add(result)
    return result
  })
}
