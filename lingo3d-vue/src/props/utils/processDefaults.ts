import { forceGet } from "@lincode/utils"
import getDefaultValue from "lingo3d/lib/interface/utils/getDefaultValue"

const cache = new WeakMap<Record<string, any>, Record<string, any>>()
const processed = new WeakSet<Record<string, any>>()

export default (defaults: Record<string, any>) => {
  if (processed.has(defaults)) return defaults

  return forceGet(cache, defaults, () => {
    const result = Object.fromEntries(
      Object.keys(defaults).map((key) => [key, getDefaultValue(defaults, key)])
    )
    processed.add(result)
    return result
  })
}
