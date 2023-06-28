import TranslateIcon from "./icons/TranslateIcon"
import RotateIcon from "./icons/RotateIcon"
import ScaleIcon from "./icons/ScaleIcon"
import AbsoluteIcon from "./icons/AbsoluteIcon"
import RelativeIcon from "./icons/RelativeIcon"
import ToolbarButton from "./ToolbarButton"
import CursorIcon from "./icons/CursorIcon"
import Section from "./Section"
import { setTransformControlsSpace } from "../../states/useTransformControlsSpace"
import PathIcon from "./icons/PathIcon"
import useInitCSS from "../hooks/useInitCSS"
import { setEditorMode } from "../../states/useEditorMode"
import useSyncState from "../hooks/useSyncState"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getEditorModeComputed } from "../../states/useEditorModeComputed"
import { getTransformControlsSpaceComputed } from "../../states/useTransformControlsSpaceComputed"
import { setWorldMode } from "../../states/useWorldMode"
import useInitEditor from "../hooks/useInitEditor"
import { stopPropagation } from "../utils/stopPropagation"

const Toolbar = () => {
    useInitCSS()
    useInitEditor()

    const mode = useSyncState(getEditorModeComputed)
    const space = useSyncState(getTransformControlsSpaceComputed)
    const target = useSyncState(getSelectionTarget)

    const canTranslate = target && "x" in target
    const canRotate = target && "rotationX" in target
    const canScale = target && "scaleX" in target

    return (
        <div
            ref={stopPropagation}
            className="lingo3d-ui lingo3d-bg lingo3d-toolbar"
            style={{
                width: 50,
                height: "100%",
                overflowY: "scroll"
            }}
        >
            <div
                className="lingo3d-flexcenter lingo3d-flexcol"
                style={{ opacity: 0.75, paddingTop: 12 }}
            >
                <Section>
                    <ToolbarButton
                        active={mode === "select"}
                        onClick={() => {
                            setWorldMode("editor")
                            setEditorMode("select")
                        }}
                    >
                        <CursorIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        active={mode === "translate"}
                        onClick={() => {
                            setWorldMode("editor")
                            setEditorMode("translate")
                        }}
                        disabled={!canTranslate}
                    >
                        <TranslateIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        active={mode === "rotate"}
                        disabled={!canRotate}
                        onClick={() => {
                            setWorldMode("editor")
                            setEditorMode("rotate")
                        }}
                    >
                        <RotateIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        active={mode === "scale"}
                        disabled={!canScale}
                        onClick={() => {
                            setWorldMode("editor")
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
                            setWorldPlay("editor")
                            setEditorMode("mesh")
                        }}
                    >
                        <MeshIcon />
                    </ToolbarButton> */}
                    <ToolbarButton
                        active={mode === "curve"}
                        onClick={() => {
                            setWorldMode("editor")
                            setEditorMode("curve")
                        }}
                    >
                        <PathIcon />
                    </ToolbarButton>
                </Section>

                {/* <Section>
                    <ToolbarButton onClick={openFolder}>
                        <FolderIcon />
                    </ToolbarButton>
                    <ToolbarButton onClick={openJSON}>
                        <OpenIcon />
                    </ToolbarButton>
                    <ToolbarButton onClick={saveJSON}>
                        <SaveIcon />
                    </ToolbarButton>
                </Section> */}

                {/* <Section>
                    <ToolbarButton onClick={exportJSON}>
                        <JSONIcon />
                    </ToolbarButton>
                    <ToolbarButton onClick={exportReact}>
                        <ReactIcon />
                    </ToolbarButton>
                    <ToolbarButton onClick={exportVue}>
                        <VueIcon />
                    </ToolbarButton>
                </Section> */}
            </div>
        </div>
    )
}
export default Toolbar
