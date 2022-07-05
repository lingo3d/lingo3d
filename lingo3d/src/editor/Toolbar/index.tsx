import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import TranslateIcon from "./icons/TranslateIcon"
import RotateIcon from "./icons/RotateIcon"
import ScaleIcon from "./icons/ScaleIcon"
import AbsoluteIcon from "./icons/AbsoluteIcon"
import RelativeIcon from "./icons/RelativeIcon"
import IconButton from "./IconButton"
import { useSelectionTarget, useTransformControlsMode, useTransformControlsSpace } from "../states"
import CursorIcon from "./icons/CursorIcon"
import Separator from "./Separator"
import ExportIcon from "./icons/ExportIcon"
import OpenIcon from "./icons/OpenIcont"
import ReactIcon from "./icons/ReactIcon"
import VueIcon from "./icons/VueIcon"
import exportReact from "../../api/files/exportReact"
import exportVue from "../../api/files/exportVue"
import SimpleObjectManager from "../../display/core/SimpleObjectManager"
import { useEffect, useLayoutEffect } from "preact/hooks"
import { emitEditorMountChange } from "../../events/onEditorMountChange"
import openJSON from "../../api/files/openJSON"
import exportJSON from "../../api/files/exportJSON"

preventTreeShake(h)

const Toolbar = () => {
    const [mode, setMode] = useTransformControlsMode()
    let [space, setSpace] = useTransformControlsSpace()
    if (mode === "scale") space = "local"

    const [target] = useSelectionTarget()
    const isPositioned = target && !(target instanceof SimpleObjectManager)
    // const isStatic = target && !isPositionedItem(target)

    useLayoutEffect(() => {
        // if (isStatic)
            // setMode("select")
        if (isPositioned && (mode === "scale"))
            setMode("translate")

    }, [isPositioned])

    useEffect(() => {
        emitEditorMountChange()

        return () => {
            emitEditorMountChange()
        }
    }, [])

    return (
        <div
         className="lingo3d-ui"
         style={{
             width: 50,
             height: "100%",
             background: "rgb(40, 41, 46)",
             borderRight: "1px solid rgba(255, 255, 255, 0.05)",
             overflow: "hidden"
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
                <IconButton active={mode === "scale"} disabled={isPositioned} onClick={() => setMode("scale")}>
                    <ScaleIcon />
                </IconButton>

                <Separator />

                <IconButton
                 active={space === "world"}
                 onClick={() => setSpace("world")}
                 disabled={mode === "scale" || mode === "select"}
                >
                    <AbsoluteIcon />
                </IconButton>
                <IconButton
                 active={space === "local"}
                 onClick={() => setSpace("local")}
                 disabled={mode === "select"}
                >
                    <RelativeIcon />
                </IconButton>

                <Separator />

                <IconButton onClick={openJSON}>
                    <OpenIcon />
                </IconButton>
                <IconButton onClick={exportJSON}>
                    <ExportIcon />
                </IconButton>

                <Separator />

                <IconButton onClick={exportReact}>
                    <ReactIcon />
                </IconButton>
                <IconButton onClick={exportVue}>
                    <VueIcon />
                </IconButton>
            </div>
        </div>
    )
}

register(Toolbar, "lingo3d-toolbar")