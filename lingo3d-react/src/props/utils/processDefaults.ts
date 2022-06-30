import { forceGet } from "@lincode/utils"

const cache = new WeakMap<Record<string, any>, Record<string, any>>()
const processed = new WeakSet<Record<string, any>>()

export default (defaults: Record<string, any>) => {
  if (processed.has(defaults)) return defaults

  return forceGet(cache, defaults, () => {
    const result = Object.fromEntries(
      Object.entries(defaults).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value
      ])
    )
    processed.add(result)
    return result
  })
}
