import { MutableRefObject } from "preact/compat"
import { useRef } from "preact/hooks"

export default <T>(value: T): MutableRefObject<T> => {
    const ref = useRef(value)
    ref.current = value
    return ref
}
