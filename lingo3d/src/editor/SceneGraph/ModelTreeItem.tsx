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
    const [loaded, setLoaded] = useState<Object3D>()
    //@ts-ignore
    const { loadedResolvable } = appendable

    useEffect(() => {
        setLoaded(undefined)
        //@ts-ignore
        const handle = loadedResolvable.then(() => setLoaded(appendable.loadedGroup.children[0]))
        return () => {
            handle.cancel()
        }
    }, [loadedResolvable])

    return (
        <TreeItem appendable={appendable} level={level}>
            {loaded && <Object3DTreeItem appendable={appendable} level={level + 1} object3d={loaded} />}
        </TreeItem>
    )
}

export default ModelTreeItem