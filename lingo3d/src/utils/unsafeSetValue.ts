export default <T>(target: object, property: string | number, value: T) =>
    //@ts-ignore
    (target[property] = value)
