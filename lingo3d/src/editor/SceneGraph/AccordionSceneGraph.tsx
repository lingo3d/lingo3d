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
import { onSceneGraphNameChange } from "../../events/onSceneGraphNameChange"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { multipleSelectionGroupManagers } from "../../states/useMultipleSelectionTargets"
import TitleBar from "../component/bars/TitleBar"
import TitleBarButton from "../component/bars/TitleBarButton"
import EmptyTreeItem from "../component/treeItems/EmptyTreeItem"
import TreeItemContextProvider from "../component/treeItems/TreeItemContextProviter"
import deleteSelected from "../Editor/deleteSelected"
import {
    useMultipleSelectionTargets,
    useSelectionTarget,
    useSelectionNativeTarget
} from "../states"
import DeleteIcon from "./icons/DeleteIcon"
import FindIcon from "./icons/FindIcon"
import GroupIcon from "./icons/GroupIcon"
import ModelTreeItem from "./ModelTreeItem"
import TreeItem from "./TreeItem"

const AccordionSceneGraph = () => {
    const [refresh, setRefresh] = useState({})
    useLayoutEffect(() => {
        const cb = () => setRefresh({})
        const handle0 = onSceneGraphChange(cb)
        const handle1 = onSceneGraphNameChange(cb)

        return () => {
            handle0.cancel()
            handle1.cancel()
        }
    }, [])

    const appendables = useMemo(
        () =>
            [...appendableRoot].filter(
                (item) =>
                    !multipleSelectionGroupManagers.has(item) &&
                    !hiddenAppendables.has(item)
            ),
        [refresh]
    )

    const [multipleSelectionTargets] = useMultipleSelectionTargets()
    const [selectionTarget] = useSelectionTarget()
    const [nativeTarget] = useSelectionNativeTarget()

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
                    <TitleBarButton
                        disabled={!nativeTarget}
                        onClick={handleFind}
                    >
                        <FindIcon />
                    </TitleBarButton>
                    <TitleBarButton
                        disabled={!multipleSelectionTargets.length}
                        onClick={emitEditorGroupItems}
                    >
                        <GroupIcon />
                    </TitleBarButton>
                    <TitleBarButton
                        disabled={!selectionTarget}
                        onClick={deleteSelected}
                    >
                        <DeleteIcon />
                    </TitleBarButton>
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
