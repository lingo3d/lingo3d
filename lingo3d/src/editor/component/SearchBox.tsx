import { CSSProperties, useEffect, useState } from "preact/compat"
import useStopPropagation from "../hooks/useStopPropagation"
import CloseIcon from "./icons/CloseIcon"

type SearchBoxProps = {
    style?: CSSProperties
    fullWidth?: boolean
    onChange?: (val: string) => void
    clearOnChange?: any
}

const SearchBox = ({
    style,
    fullWidth,
    onChange,
    clearOnChange
}: SearchBoxProps) => {
    const [text, setText] = useState<string>()
    const inputRef = useStopPropagation<HTMLInputElement>()

    useEffect(() => {
        setText("")
        inputRef.current!.value = ""
    }, [clearOnChange])

    useEffect(() => {
        const timeout = setTimeout(
            () => text !== undefined && onChange?.(text.trim()),
            300
        )
        return () => {
            clearTimeout(timeout)
        }
    }, [text])

    return (
        <div
            className="lingo3d-flexcenter"
            style={{
                width: "100%",
                flexShrink: 0,
                marginBottom: 8,
                ...style
            }}
        >
            <div
                style={{
                    display: "flex",
                    outline: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.02)",
                    width: fullWidth ? "calc(100% - 2px)" : "calc(100% - 20px)"
                }}
            >
                <input
                    ref={inputRef}
                    className="lingo3d-unset"
                    style={{ flexGrow: 1, paddingLeft: 4 }}
                    placeholder="Search..."
                    onInput={(e) => setText(e.currentTarget.value)}
                />
                <div
                    className="lingo3d-flexcenter"
                    style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        width: 22,
                        height: 22,
                        opacity: text ? 1 : 0.2,
                        cursor: text ? "pointer" : undefined
                    }}
                    onClick={() => {
                        setText("")
                        inputRef.current!.value = ""
                    }}
                >
                    <CloseIcon />
                </div>
            </div>
        </div>
    )
}

export default SearchBox
