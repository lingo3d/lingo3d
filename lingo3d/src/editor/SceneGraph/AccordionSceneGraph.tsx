import { useLayoutEffect, useMemo, useState } from "preact/hooks"
import { appendableRoot, hiddenAppendables } from "../../api/core/collections"
import ObjectManager from "../../display/core/ObjectManager"
import Model from "../../display/Model"
import scene from "../../engine/scene"
import { emitEditorGroupItems } from "../../events/onEditorGroupItems"
import {
    emitSceneGraphChange,
    onSceneGraphChange
} from "../../events/onSceneGraphChange"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import TitleBar from "../component/bars/TitleBar"
import IconButton from "../component/IconButton"
import EmptyTreeItem from "../component/treeItems/EmptyTreeItem"
import TreeItemContextProvider from "../component/treeItems/TreeItemContextProviter"
import deleteSelected from "../Editor/deleteSelected"
import useSyncState from "../hooks/useSyncState"
import DeleteIcon from "./icons/DeleteIcon"
import FindIcon from "./icons/FindIcon"
import GroupIcon from "./icons/GroupIcon"
import ModelTreeItem from "./ModelTreeItem"
import TreeItem from "./TreeItem"

const AccordionSceneGraph = () => {
    const [refresh, setRefresh] = useState({})
    useLayoutEffect(() => {
        const handle = onSceneGraphChange(() => setRefresh({}))
        return () => {
            handle.cancel()
        }
    }, [])

    const appendables = useMemo(
        () =>
            [...appendableRoot].filter((item) => !hiddenAppendables.has(item)),
        [refresh]
    )

    const multipleSelectionTargets = useSyncState(getMultipleSelectionTargets)
    const selectionTarget = useSyncState(getSelectionTarget)
    const nativeTarget = useSyncState(getSelectionNativeTarget)

    const handleFind = () => {
        if (nativeTarget?.name && selectionTarget instanceof ObjectManager)
            setTimeout(() =>
                emitSelectionTarget(selectionTarget.find(nativeTarget.name))
            )
    }

    return (
        <div>
            <div
                className="lingo3d-absfull"
                style={{ display: "flex", flexDirection: "column" }}
            >
                <TitleBar title="scenegraph">
                    <IconButton disabled={!nativeTarget} onClick={handleFind}>
                        <FindIcon />
                    </IconButton>
                    <IconButton
                        disabled={!multipleSelectionTargets.length}
                        onClick={emitEditorGroupItems}
                    >
                        <GroupIcon />
                    </IconButton>
                    <IconButton
                        disabled={!selectionTarget}
                        onClick={deleteSelected}
                    >
                        <DeleteIcon />
                    </IconButton>
                </TitleBar>
                <div style={{ overflow: "scroll", flexGrow: 1 }}>
                    <TreeItemContextProvider>
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
                    </TreeItemContextProvider>
                </div>
            </div>
        </div>
    )
}

export default AccordionSceneGraph
