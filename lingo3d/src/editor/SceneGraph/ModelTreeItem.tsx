import { h } from "preact"
import { useEffect, useState } from "preact/hooks"
import { preventTreeShake } from "@lincode/utils"
import Model from "../../display/Model"
import { Object3D } from "three"
import TreeItem, { TreeItemProps } from "./TreeItem"
import Object3DTreeItem from "./Object3DTreeItem"

preventTreeShake(h)

type ModelTreeItemProps = TreeItemProps & {
    appendable: Model
}

const ModelTreeItem = ({ appendable, level }: ModelTreeItemProps) => {
    const [loadedObject3d, setLoadedObject3d] = useState<Object3D>()
    const { loaded } = appendable

    useEffect(() => {
        setLoadedObject3d(undefined)
        const handle = loaded.then(() => setLoadedObject3d(appendable.loadedGroup.children[0]))
        return () => {
            handle.cancel()
        }
    }, [loaded])

    return (
        <TreeItem appendable={appendable} level={level}>
            {loadedObject3d && <Object3DTreeItem appendable={appendable} level={level + 1} object3d={loadedObject3d} />}
        </TreeItem>
    )
}

export default ModelTreeItem