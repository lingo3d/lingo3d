import Choices from "./Choices"
import Range from "./Range"

type Options<T> = Partial<{
    [key in keyof T]: Range | Choices
}>
export default Options
