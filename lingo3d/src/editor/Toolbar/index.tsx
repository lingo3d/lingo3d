import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import TranslateIcon from "./icons/TranslateIcon"
import RotateIcon from "./icons/RotateIcon"
import ScaleIcon from "./icons/ScaleIcon"
import AbsoluteIcon from "./icons/AbsoluteIcon"
import RelativeIcon from "./icons/RelativeIcon"
import IconButton from "./IconButton"
import {
    useSelectionTarget,
    useTransformControlsMode,
    useTransformControlsSpace
} from "../states"
import CursorIcon from "./icons/CursorIcon"
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
import Section from "./Section"

preventTreeShake(h)

type ButtonOptions = {
    hidden?: boolean
    onClick?: () => void
}

interface ToolbarProps {
    buttons?: {
        openJSON?: ButtonOptions
        exportJSON?: ButtonOptions
        exportReact?: ButtonOptions
        exportVue?: ButtonOptions
    }
}

const Toolbar = ({ buttons }: ToolbarProps) => {
    const [mode, setMode] = useTransformControlsMode()
    let [space, setSpace] = useTransformControlsSpace()
    if (mode === "scale") space = "local"

    const [target] = useSelectionTarget()
    const isPositioned = target && !(target instanceof SimpleObjectManager)
    // const isStatic = target && !isPositionedItem(target)

    useLayoutEffect(() => {
        // if (isStatic)
        // setMode("select")
        if (isPositioned && mode === "scale") setMode("translate")
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
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    opacity: 0.75,
                    paddingTop: 12
                }}
            >
                <Section>
                    <IconButton
                        active={mode === "select"}
                        onClick={() => setMode("select")}
                    >
                        <CursorIcon />
                    </IconButton>
                    <IconButton
                        active={mode === "translate"}
                        onClick={() => setMode("translate")}
                    >
                        <TranslateIcon />
                    </IconButton>
                    <IconButton
                        active={mode === "rotate"}
                        onClick={() => setMode("rotate")}
                    >
                        <RotateIcon />
                    </IconButton>
                    <IconButton
                        active={mode === "scale"}
                        disabled={isPositioned}
                        onClick={() => setMode("scale")}
                    >
                        <ScaleIcon />
                    </IconButton>
                </Section>

                <Section>
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
                </Section>

                <Section>
                    {!buttons?.openJSON?.hidden && (
                        <IconButton onClick={buttons?.openJSON?.onClick ?? openJSON}>
                            <OpenIcon />
                        </IconButton>
                    )}
                    {!buttons?.exportJSON?.hidden && (
                        <IconButton onClick={buttons?.exportJSON?.onClick ?? exportJSON}>
                            <ExportIcon />
                        </IconButton>
                    )}
                </Section>

                <Section>
                    {!buttons?.exportReact?.hidden && (
                        <IconButton onClick={buttons?.exportReact?.onClick ?? exportReact}>
                            <ReactIcon />
                        </IconButton>
                    )}
                    {!buttons?.exportVue?.hidden && (
                        <IconButton onClick={buttons?.exportVue?.onClick ?? exportVue}>
                            <VueIcon />
                        </IconButton>
                    )}
                </Section>
            </div>
        </div>
    )
}
export default Toolbar

register(Toolbar, "lingo3d-toolbar", ["buttons"])
