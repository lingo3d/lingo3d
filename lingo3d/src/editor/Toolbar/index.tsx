import register from "preact-custom-element"
import TranslateIcon from "./icons/TranslateIcon"
import RotateIcon from "./icons/RotateIcon"
import ScaleIcon from "./icons/ScaleIcon"
import AbsoluteIcon from "./icons/AbsoluteIcon"
import RelativeIcon from "./icons/RelativeIcon"
import IconButton from "./IconButton"
import {
    useEditorMode,
    useSelectionTarget,
    useTransformControlsSpaceComputed
} from "../states"
import CursorIcon from "./icons/CursorIcon"
import OpenIcon from "./icons/OpenIcont"
import ReactIcon from "./icons/ReactIcon"
import VueIcon from "./icons/VueIcon"
import exportReact from "../../api/files/exportReact"
import exportVue from "../../api/files/exportVue"
import openJSON from "../../api/files/openJSON"
import Section from "./Section"
import { setTransformControlsSpace } from "../../states/useTransformControlsSpace"
import { isPositionedItem } from "../../api/core/PositionedItem"
import SimpleObjectManager from "../../display/core/SimpleObjectManager"
import PlayIcon from "./icons/PlayIcon"
import MeshIcon from "./icons/MeshIcon"
import PathIcon from "./icons/PathIcon"
import FolderIcon from "./icons/FolderIcon"
import SaveIcon from "./icons/SaveIcon"
import saveJSON from "../../api/files/saveJSON"
import openFolder from "../../api/files/openFolder"
import exportJSON from "../../api/files/exportJSON"
import JSONIcon from "./icons/JSONIcon"
import useInitCSS from "../utils/useInitCSS"
import useClickable from "../utils/useClickable"
import TransformButton from "./TransformButton"

const Toolbar = () => {
    useInitCSS(true)
    const elRef = useClickable()

    const [editorMode, setEditorMode] = useEditorMode()
    const [space] = useTransformControlsSpaceComputed()
    const [target] = useSelectionTarget()
    const selectOnly = target && !isPositionedItem(target)
    const translateOnly =
        target &&
        isPositionedItem(target) &&
        !(target instanceof SimpleObjectManager)

    return (
        <div
            ref={elRef}
            className="lingo3d-ui lingo3d-bg lingo3d-toolbar"
            style={{
                width: 50,
                height: "100%",
                overflowY: "scroll"
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
                        active={editorMode === "select"}
                        onClick={() => setEditorMode("select")}
                    >
                        <CursorIcon />
                    </IconButton>
                    <TransformButton
                        active={editorMode === "translate"}
                        onClick={() => setEditorMode("translate")}
                        disabled={selectOnly}
                        selectOnly={selectOnly}
                    >
                        <TranslateIcon />
                    </TransformButton>
                    <TransformButton
                        active={editorMode === "rotate"}
                        disabled={translateOnly || selectOnly}
                        onClick={() => setEditorMode("rotate")}
                        translateOnly={translateOnly}
                        selectOnly={selectOnly}
                    >
                        <RotateIcon />
                    </TransformButton>
                    <TransformButton
                        active={editorMode === "scale"}
                        disabled={translateOnly || selectOnly}
                        onClick={() => setEditorMode("scale")}
                        translateOnly={translateOnly}
                        selectOnly={selectOnly}
                    >
                        <ScaleIcon />
                    </TransformButton>
                    {/* <IconButton
                        active={mode === "mesh"}
                        onClick={() => setEditorMode("mesh")}
                    >
                        <MeshIcon />
                    </IconButton> */}
                    <IconButton
                        active={editorMode === "path"}
                        onClick={() => setEditorMode("path")}
                    >
                        <PathIcon />
                    </IconButton>
                    <IconButton
                        active={editorMode === "play"}
                        onClick={() => setEditorMode("play")}
                    >
                        <PlayIcon />
                    </IconButton>
                </Section>

                <Section>
                    <IconButton
                        active={space === "world"}
                        onClick={() => setTransformControlsSpace("world")}
                        disabled={
                            editorMode !== "translate" &&
                            editorMode !== "rotate"
                        }
                    >
                        <AbsoluteIcon />
                    </IconButton>
                    <IconButton
                        active={space === "local"}
                        onClick={() => setTransformControlsSpace("local")}
                        disabled={
                            editorMode !== "translate" &&
                            editorMode !== "rotate" &&
                            editorMode !== "scale"
                        }
                    >
                        <RelativeIcon />
                    </IconButton>
                </Section>

                <Section>
                    <IconButton onClick={openFolder}>
                        <FolderIcon />
                    </IconButton>
                    <IconButton onClick={openJSON}>
                        <OpenIcon />
                    </IconButton>
                    <IconButton onClick={saveJSON}>
                        <SaveIcon />
                    </IconButton>
                </Section>

                <Section>
                    <IconButton onClick={exportJSON}>
                        <JSONIcon />
                    </IconButton>
                    <IconButton onClick={exportReact}>
                        <ReactIcon />
                    </IconButton>
                    <IconButton onClick={exportVue}>
                        <VueIcon />
                    </IconButton>
                </Section>
            </div>
        </div>
    )
}
export default Toolbar

register(Toolbar, "lingo3d-toolbar")
