import { emitSelectionTarget } from "../../events/onSelectionTarget"
import SceneGraphContextMenu from "./SceneGraphContextMenu"
import useInitCSS from "../hooks/useInitCSS"
import AccordionSceneGraph from "./AccordionSceneGraph"
import useInitEditor from "../hooks/useInitEditor"
import { toggleRightClickPtr } from "../../api/mouse"
import { stopPropagation } from "../utils/stopPropagation"
import mergeRefs from "../hooks/mergeRefs"
import { enableHotKeysOnElement } from "../../engine/hotkeys"
import ResizableRows from "../component/ResizableRows"

const SceneGraph = () => {
    useInitCSS()
    useInitEditor()

    return (
        <>
            <div
                ref={mergeRefs(stopPropagation, enableHotKeysOnElement)}
                className="lingo3d-ui lingo3d-bg lingo3d-scenegraph"
                onClick={() => emitSelectionTarget(undefined)}
                onContextMenu={(e) => {
                    toggleRightClickPtr(e.clientX, e.clientY)
                    emitSelectionTarget(undefined)
                }}
                style={{
                    width: 200,
                    height: "100%",
                    display: "grid",
                    gridTemplateRows: "1fr auto"
                }}
            >
                <ResizableRows>
                    <AccordionSceneGraph />
                    <div>hello world</div>
                    <div>hello world</div>
                </ResizableRows>
            </div>
            <SceneGraphContextMenu />
        </>
    )
}
export default SceneGraph
