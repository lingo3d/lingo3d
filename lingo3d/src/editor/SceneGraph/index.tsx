import { emitSelectionTarget } from "../../events/onSelectionTarget"
import SceneGraphContextMenu from "./SceneGraphContextMenu"
import useInitCSS from "../hooks/useInitCSS"
import AccordionSceneGraph from "./AccordionSceneGraph"
import useInitEditor from "../hooks/useInitEditor"
import { toggleRightClick } from "../../api/mouse"
import { stopPropagation } from "../utils/stopPropagation"
import mergeRefs from "../hooks/mergeRefs"
import { enableHotKeysOnElement } from "../../engine/hotkeys"

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
                    toggleRightClick(e.clientX, e.clientY)
                    emitSelectionTarget(undefined)
                }}
                style={{ width: 200, height: "100%" }}
            >
                <AccordionSceneGraph />
            </div>
            <SceneGraphContextMenu />
        </>
    )
}
export default SceneGraph
