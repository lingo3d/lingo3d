//@ts-ignore
type Access<T, Key> = T[Key]

export default <T extends object, Key extends string>(
    target: T,
    property: Key,
    ...args: Array<any>
): Access<T, Key> extends () => any ? ReturnType<Access<T, Key>> : never =>
    (target as any)[property].apply(target, args)
