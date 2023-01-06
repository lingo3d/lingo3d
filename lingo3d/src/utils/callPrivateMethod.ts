//@ts-ignore
type AccessReturn<T, Key> = T[Key] extends () => void ? T[Key] : never

export default <T extends object, Key extends string>(
    target: T,
    property: Key,
    arg?: any
): ReturnType<AccessReturn<T, Key>> =>
    (target as any)[property].call(target, arg)
