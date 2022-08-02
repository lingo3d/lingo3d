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
    useTransformControlsModeComputed,
    useTransformControlsSpaceComputed
} from "../states"
import CursorIcon from "./icons/CursorIcon"
import ExportIcon from "./icons/ExportIcon"
import OpenIcon from "./icons/OpenIcont"
import ReactIcon from "./icons/ReactIcon"
import VueIcon from "./icons/VueIcon"
import exportReact from "../../api/files/exportReact"
import exportVue from "../../api/files/exportVue"
import { useEffect } from "preact/hooks"
import openJSON from "../../api/files/openJSON"
import exportJSON from "../../api/files/exportJSON"
import Section from "./Section"
import useInit from "../utils/useInit"
import { setTransformControlsMode } from "../../states/useTransformControlsMode"
import { setTransformControlsSpace } from "../../states/useTransformControlsSpace"
import { isPositionedItem } from "../../api/core/PositionedItem"
import SimpleObjectManager from "../../display/core/SimpleObjectManager"
import PlayIcon from "./icons/PlayIcon"
import {
    decreaseEditorMounted,
    increaseEditorMounted
} from "../../states/useEditorMounted"
import { setEditing } from "../../states/useEditing"

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
    const elRef = useInit()

    const [mode] = useTransformControlsModeComputed()
    const [space] = useTransformControlsSpaceComputed()
    const [target] = useSelectionTarget()
    const translateOnly =
        target &&
        isPositionedItem(target) &&
        !(target instanceof SimpleObjectManager)

    useEffect(() => {
        increaseEditorMounted()

        return () => {
            decreaseEditorMounted()
        }
    }, [])

    return (
        <div
            ref={elRef}
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
                        onClick={() => {
                            setTransformControlsMode("select")
                            setEditing(true)
                        }}
                    >
                        <CursorIcon />
                    </IconButton>
                    <IconButton
                        active={mode === "translate"}
                        onClick={() => {
                            setTransformControlsMode("translate")
                            setEditing(true)
                        }}
                    >
                        <TranslateIcon />
                    </IconButton>
                    <IconButton
                        active={mode === "rotate"}
                        disabled={translateOnly}
                        onClick={() => {
                            setTransformControlsMode("rotate")
                            setEditing(true)
                        }}
                    >
                        <RotateIcon />
                    </IconButton>
                    <IconButton
                        active={mode === "scale"}
                        disabled={translateOnly}
                        onClick={() => {
                            setTransformControlsMode("scale")
                            setEditing(true)
                        }}
                    >
                        <ScaleIcon />
                    </IconButton>
                    <IconButton
                        active={mode === "none"}
                        onClick={() => setEditing(false)}
                    >
                        <PlayIcon />
                    </IconButton>
                </Section>

                <Section>
                    <IconButton
                        active={space === "world"}
                        onClick={() => setTransformControlsSpace("world")}
                        disabled={
                            mode === "scale" ||
                            mode === "select" ||
                            mode === "none"
                        }
                    >
                        <AbsoluteIcon />
                    </IconButton>
                    <IconButton
                        active={space === "local"}
                        onClick={() => setTransformControlsSpace("local")}
                        disabled={mode === "select" || mode === "none"}
                    >
                        <RelativeIcon />
                    </IconButton>
                </Section>

                <Section>
                    {!buttons?.openJSON?.hidden && (
                        <IconButton
                            onClick={buttons?.openJSON?.onClick ?? openJSON}
                        >
                            <OpenIcon />
                        </IconButton>
                    )}
                    {!buttons?.exportJSON?.hidden && (
                        <IconButton
                            onClick={buttons?.exportJSON?.onClick ?? exportJSON}
                        >
                            <ExportIcon />
                        </IconButton>
                    )}
                </Section>

                <Section>
                    {!buttons?.exportReact?.hidden && (
                        <IconButton
                            onClick={
                                buttons?.exportReact?.onClick ?? exportReact
                            }
                        >
                            <ReactIcon />
                        </IconButton>
                    )}
                    {!buttons?.exportVue?.hidden && (
                        <IconButton
                            onClick={buttons?.exportVue?.onClick ?? exportVue}
                        >
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
