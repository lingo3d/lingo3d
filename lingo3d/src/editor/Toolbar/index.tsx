import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import MoveIcon from "./icons/MoveIcon"
import RotateIcon from "./icons/RotateIcon"
import ScaleIcon from "./icons/ScaleIcon"
import AbsoluteIcon from "./icons/AbsoluteIcon"
import RelativeIcon from "./icons/RelativeIcon"

preventTreeShake(h)

const Toolbar = () => {
    return (
        <div
         className="lingo3d-ui"
         style={{
             width: 50,
             height: "100%",
             background: "rgb(40, 41, 46)"
         }}
        >
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                opacity: 0.75,
                marginTop: 20
            }}>
                <MoveIcon />
                <RotateIcon />
                <ScaleIcon />
                <AbsoluteIcon />
                <RelativeIcon />
            </div>
            
        </div>
    )
}

register(Toolbar, "lingo3d-toolbar")