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
import serialize from "../../display/utils/serializer/serialize"
import OpenIcon from "./icons/OpenIcont"
import { fileOpen } from "browser-fs-access"
import deserialize from "../../display/utils/serializer/deserialize"
import { appendableRoot } from "../../api/core/Appendable"
import ReactIcon from "./icons/ReactIcon"
import VueIcon from "./icons/VueIcon"
import saveTextFile from "./saveTextFile"
import serializeReact from "./serializeReact"
import serializeVue from "./serializeVue"
import SimpleObjectManager from "../../display/core/SimpleObjectManager"
import { useLayoutEffect } from "preact/hooks"

preventTreeShake(h)

const handleSave = async () => {
    const prettier = (await import("prettier/standalone")).default
    const parser = (await import("prettier/parser-babel")).default

    const code = prettier.format(JSON.stringify(serialize()), { parser: "json", plugins: [parser] })
    saveTextFile("scene.json", code)
}

const handleOpen = async () => {
    const blob = await fileOpen({
        extensions: [".json"]
    })
    const text = await blob.text()

    for (const child of appendableRoot)
        child.dispose()

    try {
        deserialize(JSON.parse(text))
    }
    catch {}
}

const Toolbar = () => {
    const [mode, setMode] = useTransformControlsMode()
    let [space, setSpace] = useTransformControlsSpace()
    if (mode === "scale") space = "local"

    const [target] = useSelectionTarget()
    const isPositioned = target && !(target instanceof SimpleObjectManager)

    useLayoutEffect(() => {
        isPositioned && (mode === "rotate" || mode === "scale") && setMode("translate")
    }, [isPositioned])

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
                <IconButton active={mode === "rotate"} disabled={isPositioned} onClick={() => setMode("rotate")}>
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

                <IconButton onClick={handleOpen}>
                    <OpenIcon />
                </IconButton>
                <IconButton onClick={handleSave}>
                    <ExportIcon />
                </IconButton>

                <Separator />

                <IconButton onClick={serializeReact}>
                    <ReactIcon />
                </IconButton>
                <IconButton onClick={serializeVue}>
                    <VueIcon />
                </IconButton>
            </div>
        </div>
    )
}

register(Toolbar, "lingo3d-toolbar")