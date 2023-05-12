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

    useEffect(() => {
        setLoadedObject3d(undefined)
        const handle = appendable.$events.on("loaded", setLoadedObject3d)
        return () => {
            handle.cancel()
        }
    }, [appendable])

    return (
        <TreeItem appendable={appendable} expandable={!!loadedObject3d}>
            {loadedObject3d && (
                <NativeTreeItem
                    object3d={loadedObject3d}
                    appendable={appendable}
                />
            )}
        </TreeItem>
    )
}

export default ModelTreeItem
