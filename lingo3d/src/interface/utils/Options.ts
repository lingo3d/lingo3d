import Range from "./Range"

type Options<T> = Partial<{
    [key in keyof T]: Range
}>
export default Options
