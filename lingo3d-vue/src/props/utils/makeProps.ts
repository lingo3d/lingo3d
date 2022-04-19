export default <T>(schema: T, defaults: any): T => Object.fromEntries(
    Object.entries(schema).map(([key, value]) => [key, { type: value, default: defaults[key] }])
) as any