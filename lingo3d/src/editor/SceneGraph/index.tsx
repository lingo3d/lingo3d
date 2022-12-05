import { emitSelectionTarget } from "../../events/onSelectionTarget"
import SceneGraphContextMenu from "./SceneGraphContextMenu"
import "./retargetBones"
import useInitCSS from "../hooks/useInitCSS"
import useClickable from "../hooks/useClickable"
import AccordionSceneGraph from "./AccordionSceneGraph"
import AccordionTimelines from "./AccordionTimelines"

const SceneGraph = () => {
    useInitCSS()
    const elRef = useClickable()

    return (
        <>
            <div
                ref={elRef}
                className="lingo3d-ui lingo3d-bg lingo3d-scenegraph"
                onClick={() => emitSelectionTarget(undefined)}
                onContextMenu={(el) => {
                    el.preventDefault()
                    emitSelectionTarget(undefined, true)
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
