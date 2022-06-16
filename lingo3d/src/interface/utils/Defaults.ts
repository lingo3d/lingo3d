type Defaults<T> = {
    [key in keyof T]: T[key] | [undefined, T[key]]
}
export default Defaults