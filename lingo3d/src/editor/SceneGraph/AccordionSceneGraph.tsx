import { useMemo } from "preact/hooks"
import Model from "../../display/Model"
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
import FoundManager from "../../display/core/FoundManager"
import groupSelected from "../../engine/hotkeys/groupSelected"
import root from "../../api/root"
import moveSelected from "../../engine/hotkeys/moveSelected"
import { isTemplate } from "../../typeGuards/isTemplate"

const AccordionSceneGraph = () => {
    const refresh = useSceneGraphRefresh()
    const appendables = useMemo(
        () =>
            [...appendableRoot].filter(
                (item) => !item.$disableSceneGraph && !isTemplate(item)
            ),
        [refresh]
    )
    const [multipleSelectionTargets] = useSyncState(getMultipleSelectionTargets)
    const selectionTarget = useSyncState(getSelectionTarget)

    return (
        <div className="lingo3d-absfull lingo3d-flexcol">
            <TitleBar title="scenegraph">
                {/* <IconButton
                    borderless
                    disabled={
                        !(
                            selectionTarget instanceof FoundManager &&
                            selectionTarget.$disableSceneGraph
                        )
                    }
                >
                    <FindIcon />
                </IconButton> */}
                <IconButton
                    borderless
                    disabled={!multipleSelectionTargets.size}
                    onClick={groupSelected}
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
                <EmptyTreeItem onDrop={() => moveSelected(root)} />
            </div>
        </div>
    )
}

export default AccordionSceneGraph
