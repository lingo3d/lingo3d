//@ts-ignore
type Access<T, Key> = Key extends "constructor" ? any : T[Key]

type UnknownToAny<T> = T extends
    | string
    | number
    | boolean
    | object
    | Function
    | undefined
    | null
    ? T
    : any

export default <T extends object, Key extends string>(
    target: T,
    property: Key
) => (target as any)[property] as UnknownToAny<Access<T, Key>>
