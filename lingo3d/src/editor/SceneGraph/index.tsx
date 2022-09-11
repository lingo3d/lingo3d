import { h } from "preact"
import { useLayoutEffect, useMemo, useState } from "preact/hooks"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
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
import TitleBarButton from "./TitleBarButton"
import {
    useMultipleSelectionTargets,
    useSceneGraphTarget,
    useSelectionTarget
} from "../states"
import deleteSelected from "../Editor/deleteSelected"
import { emitEditorGroupItems } from "../../events/onEditorGroupItems"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import FindIcon from "./icons/FindIcon"
import ObjectManager from "../../display/core/ObjectManager"
import SceneGraphContextMenu from "./SceneGraphContextMenu"
import { onSceneGraphNameChange } from "../../events/onSceneGraphNameChange"
import retargetBones from "./retargetBones"
import useInit from "../utils/useInit"
import {
    decreaseEditorMounted,
    increaseEditorMounted
} from "../../states/useEditorMounted"
import EmptyTreeItem from "../component/EmptyTreeItem"
import scene from "../../engine/scene"

preventTreeShake([h, retargetBones])

const SceneGraph = () => {
    const [r, render] = useState({})
    const elRef = useInit()

    useLayoutEffect(() => {
        const cb = () => render({})
        const handle0 = onSceneGraphChange(cb)
        const handle1 = onSceneGraphNameChange(cb)
        increaseEditorMounted()

        return () => {
            handle0.cancel()
            handle1.cancel()
            decreaseEditorMounted()
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
    const [sceneGraphTarget] = useSceneGraphTarget()

    const handleFind = () => {
        if (sceneGraphTarget?.name && selectionTarget instanceof ObjectManager)
            setTimeout(() =>
                emitSelectionTarget(selectionTarget.find(sceneGraphTarget.name))
            )
    }

    return (
        <div
            ref={elRef}
            className="lingo3d-ui lingo3d-bg"
            onClick={() => emitSelectionTarget()}
            style={{
                width: 200,
                height: "100%",
                padding: 4,
                paddingTop: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
            }}
        >
            <div
                style={{
                    height: 24,
                    borderBottom: "1px solid rgb(255,255,255,0.1)",
                    opacity: 0.5,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 12
                }}
            >
                <div>scenegraph</div>
                <div style={{ flexGrow: 1 }} />
                <TitleBarButton
                    active={!!sceneGraphTarget}
                    onClick={handleFind}
                >
                    <FindIcon />
                </TitleBarButton>
                <TitleBarButton
                    active={!!multipleSelectionTargets.length}
                    onClick={emitEditorGroupItems}
                >
                    <GroupIcon />
                </TitleBarButton>
                <TitleBarButton
                    active={!!selectionTarget}
                    onClick={deleteSelected}
                >
                    <DeleteIcon />
                </TitleBarButton>
            </div>
            <div style={{ overflow: "scroll" }} className="lingo3d-ui">
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
            <SceneGraphContextMenu />
        </div>
    )
}
export default SceneGraph

register(SceneGraph, "lingo3d-scenegraph")
