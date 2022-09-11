import { h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"
import { preventTreeShake } from "@lincode/utils"
import { Object3D } from "three"
import { makeTreeItemCallbacks, TreeItemProps } from "./TreeItem"
import { useSceneGraphExpanded, useSceneGraphTarget } from "../states"
import ComponentIcon from "./icons/ComponentIcon"
import BaseTreeItem from "../component/BaseTreeItem"

preventTreeShake(h)

type Object3DTreeItemProps = TreeItemProps & {
    object3d: Object3D
}

const Object3DTreeItem = ({ appendable, object3d }: Object3DTreeItemProps) => {
    const [expanded, setExpanded] = useState(false)
    const [sceneGraphTarget] = useSceneGraphTarget()

    const handleClick = useMemo(
        () => makeTreeItemCallbacks(object3d, appendable),
        []
    )

    const [sceneGraphExpanded, setSceneGraphExpanded] = useSceneGraphExpanded()
    useEffect(() => {
        sceneGraphExpanded?.has(object3d) && setExpanded(true)
    }, [sceneGraphExpanded])

    const selected = sceneGraphTarget === object3d

    return (
        <BaseTreeItem
            label={object3d.name}
            selected={selected}
            onCollapse={() => setSceneGraphExpanded(undefined)}
            onClick={handleClick}
            expanded={expanded}
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
