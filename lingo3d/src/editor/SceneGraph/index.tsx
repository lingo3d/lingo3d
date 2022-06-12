import { Fragment, h } from "preact"
import { useLayoutEffect, useMemo, useState } from "preact/hooks"
import register from "preact-custom-element"
import { last, preventTreeShake } from "@lincode/utils"
import { onSceneGraphChange } from "../../events/onSceneGraphChange"
import { appendableRoot, hiddenAppendables } from "../../api/core/Appendable"
import TreeItem from "./TreeItem"
import Model from "../../display/Model"
import ModelTreeItem from "./ModelTreeItem"
import { multipleSelectionGroupManagers } from "../../states/useMultipleSelectionTargets"
import GroupIcon from "./icons/GroupIcon"
import DeleteIcon from "./icons/DeleteIcon"
import TitleBarButton from "./TitleBarButton"
import { useCameraStack, useMultipleSelectionTargets, useSceneGraphTarget, useSelectionTarget } from "../states"
import deleteSelected from "../Editor/deleteSelected"
import { emitEditorGroupItems } from "../../events/onEditorGroupItems"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import EmptyItem from "./EmptyItem"
import FindIcon from "./icons/FindIcon"
import ObjectManager from "../../display/core/ObjectManager"
import mainCamera from "../../engine/mainCamera"
import ContextMenu from "./ContextMenu"
import { emitEditorMountChange } from "../../events/onEditorMountChange"
import { onSceneGraphNameChange } from "../../events/onSceneGraphNameChange"
import retargetBones from "./retargetBones"

preventTreeShake([h, retargetBones])

const SceneGraph = () => {
    const [r, render] = useState({})

    useLayoutEffect(() => {
        const cb = () => render({})
        const handle0 = onSceneGraphChange(cb)
        const handle1 = onSceneGraphNameChange(cb)
        emitEditorMountChange()

        return () => {
            handle0.cancel()
            handle1.cancel()
            emitEditorMountChange()
        }
    }, [])

    const appendables = useMemo(() => [...appendableRoot].filter(item => (
        !multipleSelectionGroupManagers.has(item)) && !hiddenAppendables.has(item)
    ), [r])

    const [multipleSelectionTargets] = useMultipleSelectionTargets()
    const [selectionTarget] = useSelectionTarget()
    const [sceneGraphTarget] = useSceneGraphTarget()
    const [cameraStack] = useCameraStack()
    const camera = last(cameraStack)

    const handleFind = () => {
        if (sceneGraphTarget?.name && selectionTarget instanceof ObjectManager)
            setTimeout(() => emitSelectionTarget(selectionTarget.find(sceneGraphTarget.name)))
    }

    return (<Fragment>
        <div
         className="lingo3d-ui"
         onClick={() => emitSelectionTarget()}
         style={{
             width: 200,
             height: "100%",
             background: "rgb(40, 41, 46)",
             padding: 4,
             paddingTop: 0,
             display: "flex",
             flexDirection: "column",
             overflow: "hidden"
         }}
        >
            <div style={{
                height: 24,
                borderBottom: "1px solid rgb(255,255,255,0.1)",
                opacity: camera === mainCamera ? 0.5 : 0.25,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12
            }}>
                <div>scenegraph</div>
                <div style={{ flexGrow: 1 }} />
                <TitleBarButton active={!!sceneGraphTarget} onClick={handleFind}>
                    <FindIcon />
                </TitleBarButton>
                <TitleBarButton active={!!multipleSelectionTargets.length} onClick={emitEditorGroupItems}>
                    <GroupIcon />
                </TitleBarButton>
                <TitleBarButton active={!!selectionTarget} onClick={deleteSelected}>
                    <DeleteIcon />
                </TitleBarButton>
            </div>
            <div style={{ overflow: "scroll", opacity: camera === mainCamera ? 1 : 0.5 }} className="lingo3d-ui">
                {appendables.map(appendable => (
                    appendable instanceof Model ? (
                        <ModelTreeItem key={appendable.uuid} appendable={appendable} level={0} />
                    ) : (
                        <TreeItem key={appendable.uuid} appendable={appendable} level={0} />
                    )
                ))}
                <EmptyItem />
            </div>
        </div>
        <ContextMenu />
    </Fragment>)
}

register(SceneGraph, "lingo3d-scenegraph")