import { h } from "preact"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake(h)

interface ShortKeysProps {
    hotkey?: string;
    hotkeyFunction?: string;
}

export default ({hotkey, hotkeyFunction}:ShortKeysProps) => {
    return (
        <div style={{display: 'flex', alignItems: 'center', fontSize: '11px', lineHeight: '1.3', marginTop: '4px', minWidth: '150px',}} >
            <div style={{width: '12px', border: "1px solid white", borderRadius: '4px', padding: '2px 4px 2px 4px', display: 'flex', justifyContent: 'center'}}>
                {hotkey}
            </div>
            <div style={{padding: '0 1px 0 1px'}}>&nbsp;-&nbsp;</div>
            <div style={{ padding: '2px 0px 2px 0px'}}>
                {hotkeyFunction}
            </div>
        </div>
    )
}