import { useLayoutEffect, useMemo, useState } from "preact/hooks"
import register from "preact-custom-element"
import {
    emitSceneGraphChange,
    onSceneGraphChange
} from "../../events/onSceneGraphChange"
import { appendableRoot, hiddenAppendables } from "../../api/core/Appendable"
import TreeItem from "./TreeItem"
import Model from "../../display/Model"
import ModelTreeItem from "./ModelTreeItem"
import { multipleSelectionGroupManagers } from "../../states/useMultipleSelectionTargets"
import GroupIcon from "./icons/GroupIcon"
import DeleteIcon from "./icons/DeleteIcon"
import TitleBarButton from "../component/TitleBarButton"
import {
    useMultipleSelectionTargets,
    useSelectionNativeTarget,
    useSelectionTarget
} from "../states"
import deleteSelected from "../Editor/deleteSelected"
import { emitEditorGroupItems } from "../../events/onEditorGroupItems"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import FindIcon from "./icons/FindIcon"
import ObjectManager from "../../display/core/ObjectManager"
import SceneGraphContextMenu from "./SceneGraphContextMenu"
import { onSceneGraphNameChange } from "../../events/onSceneGraphNameChange"
import "./retargetBones"
import EmptyTreeItem from "../component/EmptyTreeItem"
import scene from "../../engine/scene"
import TreeItemContextProvider from "../component/TreeItemContextProviter"
import TitleBar from "../component/TitleBar"
import useInitCSS from "../utils/useInitCSS"
import useClickable from "../utils/useClickable"

const SceneGraph = () => {
    useInitCSS(true)
    const [r, render] = useState({})
    const elRef = useClickable()

    useLayoutEffect(() => {
        const cb = () => render({})
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
        [r]
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
        <div
            ref={elRef}
            className="lingo3d-ui lingo3d-bg lingo3d-scenegraph"
            onClick={() => emitSelectionTarget()}
            onContextMenu={(el) => {
                el.preventDefault()
                emitSelectionTarget(undefined, true)
            }}
            style={{
                width: 200,
                height: "100%",
                paddingTop: 0,
                display: "flex",
                flexDirection: "column"
            }}
        >
            <TitleBar title="scenegraph">
                <TitleBarButton disabled={!nativeTarget} onClick={handleFind}>
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
            <div
                style={{ overflow: "scroll", flexGrow: 1 }}
                className="lingo3d-ui"
            >
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
            <SceneGraphContextMenu />
        </div>
    )
}
export default SceneGraph

register(SceneGraph, "lingo3d-scenegraph")
