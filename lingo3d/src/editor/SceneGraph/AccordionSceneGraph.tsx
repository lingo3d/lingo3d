import { useMemo } from "preact/hooks"
import { appendableRoot, hiddenAppendables } from "../../api/core/collections"
import ObjectManager, {
    getFoundManager
} from "../../display/core/ObjectManager"
import Model from "../../display/Model"
import scene from "../../engine/scene"
import { emitEditorGroupItems } from "../../events/onEditorGroupItems"
import { emitSceneGraphChange } from "../../events/onSceneGraphChange"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import TitleBar from "../component/bars/TitleBar"
import AppBarButton from "../component/AppBarButton"
import EmptyTreeItem from "../component/treeItems/EmptyTreeItem"
import deleteSelected from "../../engine/hotkeys/deleteSelected"
import useSyncState from "../hooks/useSyncState"
import DeleteIcon from "./icons/DeleteIcon"
import FindIcon from "./icons/FindIcon"
import GroupIcon from "./icons/GroupIcon"
import ModelTreeItem from "./ModelTreeItem"
import TreeItem from "./TreeItem"
import useSceneGraphRefresh from "../hooks/useSceneGraphRefresh"

const AccordionSceneGraph = () => {
    const refresh = useSceneGraphRefresh()
    const appendables = useMemo(
        () =>
            [...appendableRoot].filter((item) => !hiddenAppendables.has(item)),
        [refresh]
    )
    const [multipleSelectionTargets] = useSyncState(getMultipleSelectionTargets)
    const selectionTarget = useSyncState(getSelectionTarget)
    const nativeTarget = useSyncState(getSelectionNativeTarget)

    const handleFind = () => {
        if (nativeTarget?.name && selectionTarget instanceof ObjectManager)
            setTimeout(() =>
                emitSelectionTarget(
                    getFoundManager(nativeTarget, selectionTarget)
                )
            )
    }

    return (
        <div>
            <div className="lingo3d-absfull lingo3d-flexcol">
                <TitleBar title="scenegraph">
                    <AppBarButton disabled={!nativeTarget} onClick={handleFind}>
                        <FindIcon />
                    </AppBarButton>
                    <AppBarButton
                        disabled={!multipleSelectionTargets.size}
                        onClick={emitEditorGroupItems}
                    >
                        <GroupIcon />
                    </AppBarButton>
                    <AppBarButton
                        disabled={!selectionTarget}
                        onClick={deleteSelected}
                    >
                        <DeleteIcon />
                    </AppBarButton>
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
                        onDrop={(child) => {
                            emitSceneGraphChange()
                            appendableRoot.add(child)
                            scene.attach(child.outerObject3d)
                            child.parent?.children?.delete(child)
                            child.parent = undefined
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default AccordionSceneGraph
