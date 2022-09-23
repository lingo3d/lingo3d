import { useEffect, useMemo, useState } from "preact/hooks"
import { Object3D } from "three"
import { makeTreeItemCallbacks, TreeItemProps } from "./TreeItem"
import { useSceneGraphExpanded, useSelectionSubTarget } from "../states"
import ComponentIcon from "./icons/ComponentIcon"
import BaseTreeItem from "../component/BaseTreeItem"

type Object3DTreeItemProps = TreeItemProps & {
    object3d: Object3D
}

const Object3DTreeItem = ({ appendable, object3d }: Object3DTreeItemProps) => {
    const [expanded, setExpanded] = useState(false)
    const [subTarget] = useSelectionSubTarget()

    const handleClick = useMemo(
        () => makeTreeItemCallbacks(object3d, appendable),
        []
    )

    const [sceneGraphExpanded, setSceneGraphExpanded] = useSceneGraphExpanded()
    useEffect(() => {
        sceneGraphExpanded?.has(object3d) && setExpanded(true)
    }, [sceneGraphExpanded])

    const selected = subTarget === object3d

    return (
        <BaseTreeItem
            label={object3d.name}
            selected={selected}
            onCollapse={() => setSceneGraphExpanded(undefined)}
            onClick={handleClick}
            expanded={expanded}
            expandable={!!object3d.children.length}
            outlined
            IconComponent={ComponentIcon}
        >
            {() =>
                object3d.children.map((child) => (
                    <Object3DTreeItem
                        key={child.uuid}
                        object3d={child}
                        appendable={appendable}
                    />
                ))
            }
        </BaseTreeItem>
    )
}

export default Object3DTreeItem
