import { CSSProperties, useEffect, useState } from "preact/compat"

type SearchBoxProps = {
    style?: CSSProperties
    fullWidth?: boolean
    onChange?: (val: string) => void
}

const SearchBox = ({ style, fullWidth, onChange }: SearchBoxProps) => {
    const [text, setText] = useState<string | undefined>()

    useEffect(() => {
        const timeout = setTimeout(
            () => text !== undefined && onChange?.(text),
            500
        )
        return () => {
            clearTimeout(timeout)
        }
    }, [text])

    return (
        <div
            className="lingo3d-flexcenter"
            style={{ width: "100%", flexShrink: 0, marginBottom: 8, ...style }}
        >
            <input
                className="lingo3d-unset"
                style={{
                    outline: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.02)",
                    width: fullWidth ? "100%" : "calc(100% - 28px)",
                    padding: 4
                }}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Search property"
                onInput={(e) => setText(e.currentTarget.value)}
            />
        </div>
    )
}

export default SearchBox
