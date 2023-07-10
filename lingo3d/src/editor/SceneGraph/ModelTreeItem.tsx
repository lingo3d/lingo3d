import { useEffect, useState } from "preact/hooks"
import Model from "../../display/Model"
import { Object3D } from "three"
import TreeItem, { TreeItemProps } from "./TreeItem"
import NativeTreeItem from "./NativeTreeItem"

type ModelTreeItemProps = TreeItemProps & {
    appendable: Model
}

const ModelTreeItem = ({ appendable }: ModelTreeItemProps) => {
    const [loadedObject, setLoadedObject] = useState<Object3D>()

    useEffect(() => {
        setLoadedObject(undefined)
        const handle = appendable.$events.on("loaded", setLoadedObject)
        return () => {
            handle.cancel()
        }
    }, [appendable])

    return (
        <TreeItem appendable={appendable} expandable={!!loadedObject}>
            {loadedObject && (
                <NativeTreeItem
                    object3d={loadedObject}
                    appendable={appendable}
                />
            )}
        </TreeItem>
    )
}

export default ModelTreeItem
