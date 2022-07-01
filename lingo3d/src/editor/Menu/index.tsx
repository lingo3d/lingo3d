import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import { useState } from "preact/hooks"
import ContextMenu from '../SceneGraph/ContextMenu'

preventTreeShake(h)

const Menu = () => {
    const [hover, setHover] = useState<boolean | string>(false)


    return (
        <div
            className="lingo3d-ui"
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: 25,
                background: "rgb(35, 36, 41)",
                marginTop: -20,
                zIndex: 10,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
            }}
        >
            <ul style={{display: 'flex', flexDirection: 'row', alignItems: 'start', }}>
                <ol
                onMouseEnter={() => setHover('1')}
                onMouseLeave={() => setHover(false)}
                onClick={() => console.log('gigo')}
                style={{whiteSpace: "nowrap", textAlign: 'left', padding: '5px 10px 5px 10px', borderRadius: '4px', background: hover === '1' ? "rgba(255, 255, 255, 0.1)" : undefined}}>File</ol>
                <ol
                onMouseEnter={() => setHover('2')}
                onMouseLeave={() => setHover(false)}
                style={{whiteSpace: "nowrap", textAlign: 'left', padding: '5px 10px 5px 10px', borderRadius: '4px', background: hover === '2' ? "rgba(255, 255, 255, 0.1)" : undefined}}
                >View</ol>
                <ContextMenu />
            </ul>
        </div>
    )
}

register(Menu, "lingo3d-menu")
