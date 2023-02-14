import { emitSelectionTarget } from "../../events/onSelectionTarget"
import SceneGraphContextMenu from "./SceneGraphContextMenu"
import useInitCSS from "../hooks/useInitCSS"
import useStopPropagation from "../hooks/useStopPropagation"
import AccordionSceneGraph from "./AccordionSceneGraph"
import AccordionTimelines from "./AccordionTimelines"
import useInitEditor from "../hooks/useInitEditor"
import { toggleRightClickPtr } from "../../api/mouse"

const SceneGraph = () => {
    useInitCSS()
    useInitEditor()

    const stopRef = useStopPropagation()

    return (
        <>
            <div
                ref={stopRef}
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
