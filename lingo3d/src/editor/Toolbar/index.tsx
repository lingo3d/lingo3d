import TranslateIcon from "./icons/TranslateIcon"
import RotateIcon from "./icons/RotateIcon"
import ScaleIcon from "./icons/ScaleIcon"
import AbsoluteIcon from "./icons/AbsoluteIcon"
import RelativeIcon from "./icons/RelativeIcon"
import ToolbarButton from "./ToolbarButton"
import CursorIcon from "./icons/CursorIcon"
import OpenIcon from "./icons/OpenIcont"
import ReactIcon from "./icons/ReactIcon"
import VueIcon from "./icons/VueIcon"
import exportReact from "../../api/files/exportReact"
import exportVue from "../../api/files/exportVue"
import openJSON from "../../api/files/openJSON"
import Section from "./Section"
import { setTransformControlsSpace } from "../../states/useTransformControlsSpace"
import { isPositionedManager } from "../../display/core/PositionedManager"
import SimpleObjectManager from "../../display/core/SimpleObjectManager"
import MeshIcon from "./icons/MeshIcon"
import PathIcon from "./icons/PathIcon"
import FolderIcon from "./icons/FolderIcon"
import SaveIcon from "./icons/SaveIcon"
import saveJSON from "../../api/files/saveJSON"
import openFolder from "../../api/files/openFolder"
import exportJSON from "../../api/files/exportJSON"
import JSONIcon from "./icons/JSONIcon"
import useInitCSS from "../hooks/useInitCSS"
import useClickable from "../hooks/useClickable"
import { setEditorMode } from "../../states/useEditorMode"
import useSyncState from "../hooks/useSyncState"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getEditorModeComputed } from "../../states/useEditorModeComputed"
import { getTransformControlsSpaceComputed } from "../../states/useTransformControlsSpaceComputed"
import { setWorldPlay } from "../../states/useWorldPlay"
import JointIcon from "./icons/JointIcon"
import useInitEditor from "../hooks/useInitEditor"

const Toolbar = () => {
    useInitCSS()
    useInitEditor()

    const elRef = useClickable()

    const mode = useSyncState(getEditorModeComputed)
    const space = useSyncState(getTransformControlsSpaceComputed)
    const target = useSyncState(getSelectionTarget)
    const selectOnly = target && !isPositionedManager(target)
    const translateOnly =
        target &&
        isPositionedManager(target) &&
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
                    <ToolbarButton
                        active={mode === "select"}
                        onClick={() => {
                            setWorldPlay(false)
                            setEditorMode("select")
                        }}
                    >
                        <CursorIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        active={mode === "translate"}
                        onClick={() => {
                            setWorldPlay(false)
                            setEditorMode("translate")
                        }}
                        disabled={selectOnly}
                    >
                        <TranslateIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        active={mode === "rotate"}
                        disabled={translateOnly || selectOnly}
                        onClick={() => {
                            setWorldPlay(false)
                            setEditorMode("rotate")
                        }}
                    >
                        <RotateIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        active={mode === "scale"}
                        disabled={translateOnly || selectOnly}
                        onClick={() => {
                            setWorldPlay(false)
                            setEditorMode("scale")
                        }}
                    >
                        <ScaleIcon />
                    </ToolbarButton>
                </Section>

                <Section>
                    <ToolbarButton
                        active={space === "world"}
                        onClick={() => setTransformControlsSpace("world")}
                        disabled={mode !== "translate" && mode !== "rotate"}
                    >
                        <AbsoluteIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        active={space === "local"}
                        onClick={() => setTransformControlsSpace("local")}
                        disabled={
                            mode !== "translate" &&
                            mode !== "rotate" &&
                            mode !== "scale"
                        }
                    >
                        <RelativeIcon />
                    </ToolbarButton>
                </Section>

                <Section>
                    {/* <ToolbarButton
                        active={mode === "mesh"}
                        onClick={() => {
                            setWorldPlay(false)
                            setEditorMode("mesh")
                        }}
                    >
                        <MeshIcon />
                    </ToolbarButton> */}
                    <ToolbarButton
                        active={mode === "curve"}
                        onClick={() => {
                            setWorldPlay(false)
                            setEditorMode("curve")
                        }}
                    >
                        <PathIcon />
                    </ToolbarButton>
                </Section>

                <Section>
                    <ToolbarButton onClick={openFolder}>
                        <FolderIcon />
                    </ToolbarButton>
                    <ToolbarButton onClick={openJSON}>
                        <OpenIcon />
                    </ToolbarButton>
                    <ToolbarButton onClick={saveJSON}>
                        <SaveIcon />
                    </ToolbarButton>
                </Section>

                <Section>
                    <ToolbarButton onClick={exportJSON}>
                        <JSONIcon />
                    </ToolbarButton>
                    <ToolbarButton onClick={exportReact}>
                        <ReactIcon />
                    </ToolbarButton>
                    <ToolbarButton onClick={exportVue}>
                        <VueIcon />
                    </ToolbarButton>
                </Section>
            </div>
        </div>
    )
}
export default Toolbar
