import { CSSProperties } from "preact/compat"

type SearchBoxProps = {
    style?: CSSProperties
    fullWidth?: boolean
}

const SearchBox = ({ style, fullWidth }: SearchBoxProps) => {
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
            />
        </div>
    )
}

export default SearchBox
