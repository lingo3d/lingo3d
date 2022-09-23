import { useEffect, useState } from "preact/hooks"
import Model from "../../display/Model"
import { Object3D } from "three"
import TreeItem, { TreeItemProps } from "./TreeItem"
import NativeTreeItem from "./NativeTreeItem"

type ModelTreeItemProps = TreeItemProps & {
    appendable: Model
}

const ModelTreeItem = ({ appendable }: ModelTreeItemProps) => {
    const [loadedObject3d, setLoadedObject3d] = useState<Object3D>()
    const { loaded } = appendable

    useEffect(() => {
        setLoadedObject3d(undefined)
        const handle = loaded.then(() => {
            setLoadedObject3d(appendable.loadedGroup.children[0])
        })
        return () => {
            handle.cancel()
        }
    }, [loaded])

    return (
        <TreeItem appendable={appendable} expandable={!!loadedObject3d}>
            {loadedObject3d && (
                <NativeTreeItem
                    appendable={appendable}
                    object3d={loadedObject3d}
                />
            )}
        </TreeItem>
    )
}

export default ModelTreeItem
