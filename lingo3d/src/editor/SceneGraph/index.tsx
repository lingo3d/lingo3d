import { emitSelectionTarget } from "../../events/onSelectionTarget"
import SceneGraphContextMenu from "./SceneGraphContextMenu"
import useInitCSS from "../hooks/useInitCSS"
import AccordionSceneGraph from "./AccordionSceneGraph"
import AccordionTimelines from "./AccordionTimelines"
import useInitEditor from "../hooks/useInitEditor"
import { toggleRightClickPtr } from "../../api/mouse"
import { stopPropagation } from "../utils/stopPropagation"

const SceneGraph = () => {
    useInitCSS()
    useInitEditor()

    return (
        <>
            <div
                ref={stopPropagation}
                className="lingo3d-ui lingo3d-bg lingo3d-scenegraph"
                onClick={() => emitSelectionTarget(undefined)}
                onContextMenu={() => {
                    toggleRightClickPtr()
                    emitSelectionTarget(undefined)
                }}
                style={{
                    width: 200,
                    height: "100%",
                    display: "grid",
                    gridTemplateRows: "1fr auto"
                }}
            >
                <AccordionSceneGraph />
                {/* <AccordionTimelines /> */}
            </div>
            <SceneGraphContextMenu />
        </>
    )
}
export default SceneGraph
