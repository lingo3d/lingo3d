import processDefaults from "./processDefaults"

export default <T extends object>(schema: T, defaults: any): T => {
  defaults = processDefaults(defaults)

  return Object.fromEntries(
    Object.entries(schema).map(([key, value]) => [
      key,
      {
        type: value === Number ? [Number, Object] : value,
        default: defaults[key]
      }
    ])
  ) as any
}
