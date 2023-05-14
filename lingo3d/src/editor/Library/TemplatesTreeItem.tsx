import { useLayoutEffect, useMemo, useState } from "preact/hooks"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import getDisplayName from "../utils/getDisplayName"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import useSyncState from "../hooks/useSyncState"
import handleTreeItemClick from "../utils/handleTreeItemClick"
import CubeIcon from "../SceneGraph/icons/CubeIcon"
import PlayIcon from "../SceneGraph/icons/PlayIcon"
import Template from "../../display/Template"
import dragToCreate from "../utils/dragToCreate"
import spawn from "../../api/spawn"

const setDraggingItem = dragToCreate<Template>(spawn)

export type TemplatesTreeItemProps = {
    template: Template
}

const TemplatesTreeItem = ({ template }: TemplatesTreeItemProps) => {
    const selectionTarget = useSyncState(getSelectionTarget)
    const selected = selectionTarget === template

    const IconComponent = useMemo(() => {
        if (template instanceof AnimationManager) return PlayIcon
        return CubeIcon
    }, [template])

    const [name, setName] = useState("")
    useLayoutEffect(() => {
        setName(getDisplayName(template))
        const handle = template.$events.on("name", () =>
            setName(getDisplayName(template))
        )
        return () => {
            handle.cancel()
        }
    }, [template])

    return (
        <BaseTreeItem
            label={name}
            selected={selected}
            draggable
            onDragStart={() => setDraggingItem(template)}
            onDragEnd={() => setDraggingItem(undefined)}
            onClick={(e) => handleTreeItemClick(e, template)}
            onContextMenu={(e) => handleTreeItemClick(e, template, true)}
            IconComponent={IconComponent}
        />
    )
}

export default TemplatesTreeItem
