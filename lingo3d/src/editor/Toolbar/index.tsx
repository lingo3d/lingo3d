import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import TranslateIcon from "./icons/TranslateIcon"
import RotateIcon from "./icons/RotateIcon"
import ScaleIcon from "./icons/ScaleIcon"
import AbsoluteIcon from "./icons/AbsoluteIcon"
import RelativeIcon from "./icons/RelativeIcon"
import IconButton from "./IconButton"
import { useTransformControlsMode, useTransformControlsSpace } from "../states"
import CursorIcon from "./icons/CursorIcon"

preventTreeShake(h)

const Toolbar = () => {
    const [mode, setMode] = useTransformControlsMode()
    let [space, setSpace] = useTransformControlsSpace()
    if (mode === "scale") space = "local"

    return (
        <div
         className="lingo3d-ui"
         style={{
             width: 50,
             height: "100%",
             background: "rgb(40, 41, 46)",
             borderRight: "1px solid rgba(255, 255, 255, 0.05)"
         }}
        >
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: 0.75,
                paddingTop: 12
            }}>
                <IconButton active={mode === "select"} onClick={() => setMode("select")}>
                    <CursorIcon />
                </IconButton>
                <IconButton active={mode === "translate"} onClick={() => setMode("translate")}>
                    <TranslateIcon />
                </IconButton>
                <IconButton active={mode === "rotate"} onClick={() => setMode("rotate")}>
                    <RotateIcon />
                </IconButton>
                <IconButton active={mode === "scale"} onClick={() => setMode("scale")}>
                    <ScaleIcon />
                </IconButton>
                <div style={{ width: "60%", height: 2, background: "rgba(255, 255, 255, 0.1)", margin: 12 }} />
                <IconButton active={space === "world"} onClick={() => setSpace("world")} disabled={mode === "scale"}>
                    <AbsoluteIcon />
                </IconButton>
                <IconButton active={space === "local"} onClick={() => setSpace("local")}>
                    <RelativeIcon />
                </IconButton>
            </div>
        </div>
    )
}

register(Toolbar, "lingo3d-toolbar")