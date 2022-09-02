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
    useEditorComputed,
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
import { setEditorMode } from "../../states/useEditorMode"
import { setTransformControlsSpace } from "../../states/useTransformControlsSpace"
import { isPositionedItem } from "../../api/core/PositionedItem"
import SimpleObjectManager from "../../display/core/SimpleObjectManager"
import PlayIcon from "./icons/PlayIcon"
import {
    decreaseEditorMounted,
    increaseEditorMounted
} from "../../states/useEditorMounted"
import MeshIcon from "./icons/MeshIcon"
import PathIcon from "./icons/PathIcon"
import FolderIcon from "./icons/FolderIcon"
import { directoryOpen } from "browser-fs-access"
import { setFiles } from "../../states/useFiles"
import { setFileBrowser } from "../../states/useFileBrowser"
import { DEBUG } from "../../globals"

preventTreeShake(h)

const openFolder = async () => {
    const blobs = await directoryOpen({
        recursive: true,
        startIn: "downloads",
        id: "lingo3d",
        skipDirectory: (entry) =>
            entry.name[0] === "." || entry.name === "node_modules"
    })
    setFiles(blobs)
    setFileBrowser(true)
}

type ButtonOptions = {
    hidden?: boolean
    onClick?: () => void
}

interface ToolbarProps {
    buttons?: {
        openFolder?: ButtonOptions
        openJSON?: ButtonOptions
        exportJSON?: ButtonOptions
        exportReact?: ButtonOptions
        exportVue?: ButtonOptions
    }
}

const Toolbar = ({ buttons }: ToolbarProps) => {
    const elRef = useInit()

    const [mode] = useEditorComputed()
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
            className="lingo3d-ui lingo3d-bg"
            style={{
                width: 50,
                height: "100%",
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
                        onClick={() => setEditorMode("select")}
                    >
                        <CursorIcon />
                    </IconButton>
                    <IconButton
                        active={mode === "translate"}
                        onClick={() => setEditorMode("translate")}
                    >
                        <TranslateIcon />
                    </IconButton>
                    <IconButton
                        active={mode === "rotate"}
                        disabled={translateOnly}
                        onClick={() => setEditorMode("rotate")}
                    >
                        <RotateIcon />
                    </IconButton>
                    <IconButton
                        active={mode === "scale"}
                        disabled={translateOnly}
                        onClick={() => setEditorMode("scale")}
                    >
                        <ScaleIcon />
                    </IconButton>
                    {/* <IconButton
                        active={mode === "mesh"}
                        onClick={() => setEditorMode("mesh")}
                    >
                        <MeshIcon />
                    </IconButton> */}
                    {DEBUG && (
                        <IconButton
                            active={mode === "path"}
                            onClick={() => setEditorMode("path")}
                        >
                            <PathIcon />
                        </IconButton>
                    )}
                    <IconButton
                        active={mode === "play"}
                        onClick={() => setEditorMode("play")}
                    >
                        <PlayIcon />
                    </IconButton>
                </Section>

                <Section>
                    <IconButton
                        active={space === "world"}
                        onClick={() => setTransformControlsSpace("world")}
                        disabled={mode !== "translate" && mode !== "rotate"}
                    >
                        <AbsoluteIcon />
                    </IconButton>
                    <IconButton
                        active={space === "local"}
                        onClick={() => setTransformControlsSpace("local")}
                        disabled={
                            mode !== "translate" &&
                            mode !== "rotate" &&
                            mode !== "scale"
                        }
                    >
                        <RelativeIcon />
                    </IconButton>
                </Section>

                <Section>
                    {!buttons?.openFolder?.hidden && DEBUG && (
                        <IconButton
                            onClick={buttons?.openFolder?.onClick ?? openFolder}
                        >
                            <FolderIcon />
                        </IconButton>
                    )}
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
