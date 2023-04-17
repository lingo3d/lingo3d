import { useMemo } from "preact/hooks"
import Model from "../../display/Model"
import scene from "../../engine/scene"
import { emitEditorGroupItems } from "../../events/onEditorGroupItems"
import { emitSceneGraphChange } from "../../events/onSceneGraphChange"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import TitleBar from "../component/bars/TitleBar"
import IconButton from "../component/IconButton"
import EmptyTreeItem from "../component/treeItems/EmptyTreeItem"
import deleteSelected from "../../engine/hotkeys/deleteSelected"
import useSyncState from "../hooks/useSyncState"
import DeleteIcon from "./icons/DeleteIcon"
import FindIcon from "./icons/FindIcon"
import GroupIcon from "./icons/GroupIcon"
import ModelTreeItem from "./ModelTreeItem"
import TreeItem from "./TreeItem"
import useSceneGraphRefresh from "../hooks/useSceneGraphRefresh"
import { appendableRoot } from "../../collections/appendableRoot"
import { disableSceneGraph } from "../../collections/disableSceneGraph"
import { isTemplate } from "../../collections/typeGuards"
import Appendable from "../../api/core/Appendable"
import MeshAppendable from "../../api/core/MeshAppendable"
import FoundManager from "../../display/core/FoundManager"

const AccordionSceneGraph = () => {
    const refresh = useSceneGraphRefresh()
    const appendables = useMemo(
        () =>
            [...appendableRoot].filter(
                (item) => !disableSceneGraph.has(item) && !isTemplate(item)
            ),
        [refresh]
    )
    const [multipleSelectionTargets] = useSyncState(getMultipleSelectionTargets)
    const selectionTarget = useSyncState(getSelectionTarget)

    return (
        <div className="lingo3d-absfull lingo3d-flexcol">
            <TitleBar title="scenegraph">
                <IconButton
                    borderless
                    disabled={
                        !(
                            selectionTarget instanceof FoundManager &&
                            selectionTarget.disableSceneGraph
                        )
                    }
                    onClick={() => {
                        selectionTarget!.disableSceneGraph = false
                        selectionTarget!.disableSerialize = false
                    }}
                >
                    <FindIcon />
                </IconButton>
                <IconButton
                    borderless
                    disabled={!multipleSelectionTargets.size}
                    onClick={() => emitEditorGroupItems()}
                >
                    <GroupIcon />
                </IconButton>
                <IconButton
                    borderless
                    disabled={!selectionTarget}
                    onClick={deleteSelected}
                >
                    <DeleteIcon />
                </IconButton>
            </TitleBar>
            <div style={{ overflow: "scroll", flexGrow: 1 }}>
                {appendables.map((appendable) =>
                    appendable instanceof Model ? (
                        <ModelTreeItem
                            key={appendable.uuid}
                            appendable={appendable}
                        />
                    ) : (
                        <TreeItem
                            key={appendable.uuid}
                            appendable={appendable}
                        />
                    )
                )}
                <EmptyTreeItem
                    onDrop={(child: Appendable | MeshAppendable) => {
                        emitSceneGraphChange()
                        appendableRoot.add(child)
                        "outerObject3d" in child &&
                            scene.attach(child.outerObject3d)
                        child.parent?.children?.delete(child)
                        child.parent = undefined
                    }}
                />
            </div>
        </div>
    )
}

export default AccordionSceneGraph
