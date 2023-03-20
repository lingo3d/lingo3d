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
import AccordionTemplates from "./AccordionTemplates"
import { useMemo } from "preact/hooks"
import { appendableRoot, hiddenAppendables } from "../../api/core/collections"
import { isTemplate } from "../../display/Template"
import useSceneGraphRefresh from "../hooks/useSceneGraphRefresh"

const SceneGraph = () => {
    useInitCSS()
    useInitEditor()

    const refresh = useSceneGraphRefresh()
    const templates = useMemo(
        () =>
            [...appendableRoot].filter(
                (item) => !hiddenAppendables.has(item) && isTemplate(item)
            ),
        [refresh]
    )

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
                style={{ width: 200, height: "100%" }}
            >
                <ResizableRows>
                    <AccordionSceneGraph />
                    {!!templates.length && (
                        <AccordionTemplates appendables={templates} />
                    )}
                </ResizableRows>
            </div>
            <SceneGraphContextMenu />
        </>
    )
}
export default SceneGraph
