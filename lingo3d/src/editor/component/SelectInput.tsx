import {
    CSSProperties,
    forwardRef,
    TargetedEvent,
    useEffect,
    useState
} from "preact/compat"
import useLatest from "../hooks/useLatest"
import { stopPropagation } from "../utils/stopPropagation"

type Props = {
    style?: CSSProperties
    className?: string
    placeholder?: string
    onInput?: (e: TargetedEvent<HTMLInputElement, Event>) => void
    onKeyDown?: (e: TargetedEvent<HTMLInputElement, KeyboardEvent>) => void
    options?: Array<string>
}

const SelectInput = forwardRef<HTMLInputElement, Props>(
    ({ style, className, placeholder, onInput, onKeyDown, options }, ref) => {
        const [text, setText] = useState<string>()
        const optionsRef = useLatest(options)

        useEffect(() => {
            const options = optionsRef.current
            if (!options || !text) return

            const timeout = setTimeout(() => {
                console.log(
                    options.filter((key) =>
                        key.toLowerCase().includes(text.toLowerCase())
                    )
                )
            })
            return () => {
                clearTimeout(timeout)
            }
        }, [text])

        return (
            <div
                ref={stopPropagation}
                style={{ minWidth: 50, minHeight: 20, ...style }}
                className={className}
            >
                <input
                    ref={ref}
                    className="lingo3d-unset"
                    style={{ width: "100%", height: "100%" }}
                    placeholder={placeholder}
                    onInput={(e) => {
                        setText(e.currentTarget.value)
                        onInput?.(e)
                    }}
                    onKeyDown={onKeyDown}
                />
            </div>
        )
    }
)

export default SelectInput
