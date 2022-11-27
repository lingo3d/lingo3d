//@ts-ignore
type Access<T, Key> = T[Key]

export default <T extends object, Key extends string>(
    target: T,
    property: Key
) => (target as any)[property] as Access<T, Key>
