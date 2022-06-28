type Defaults<T> = {
    [key in keyof T]: T[key] | [undefined | number, T[key]]
}
export default Defaults