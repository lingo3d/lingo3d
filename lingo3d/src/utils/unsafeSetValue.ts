export default <T>(target: object, property: string, value: T) =>
    //@ts-ignore
    (target[property] = value)
