import { CSSProperties, forwardRef, TargetedEvent } from "preact/compat"
import { stopPropagation } from "../utils/stopPropagation"

type Props = {
    style?: CSSProperties
    className?: string
    placeholder?: string
    onInput?: (e: TargetedEvent<HTMLInputElement, Event>) => void
    onKeyDown?: (e: TargetedEvent<HTMLInputElement, KeyboardEvent>) => void
}

const SelectInput = forwardRef<HTMLInputElement, Props>(
    ({ style, className, placeholder, onInput, onKeyDown }, ref) => {
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
                    onInput={onInput}
                    onKeyDown={onKeyDown}
                />
            </div>
        )
    }
)

export default SelectInput
