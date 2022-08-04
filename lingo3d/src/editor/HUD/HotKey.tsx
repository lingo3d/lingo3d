import { h } from "preact"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake(h)

interface HotKeysProps {
    hotkey?: string
    hotkeyFunction?: string
}

export default ({ hotkey, hotkeyFunction }: HotKeysProps) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                marginTop: 4,
                whiteSpace: "nowrap"
            }}
        >
            <div
                style={{
                    border: "1px solid white",
                    borderRadius: "4px",
                    padding: "2px 4px 2px 4px"
                }}
            >
                <div
                    style={{
                        minWidth: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {hotkey}
                </div>
            </div>
            <div style={{ padding: "0 1px 0 1px" }}>&nbsp;-&nbsp;</div>
            <div style={{ padding: "2px 0px 2px 0px" }}>{hotkeyFunction}</div>
        </div>
    )
}
