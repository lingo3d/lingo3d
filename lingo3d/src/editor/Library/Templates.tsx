import { useMemo } from "preact/hooks"
import { appendableRoot, hiddenAppendables } from "../../api/core/collections"
import { isTemplate } from "../../display/Template"
import useSceneGraphRefresh from "../hooks/useSceneGraphRefresh"
import TreeItem from "../SceneGraph/TreeItem"

const Templates = () => {
    const refresh = useSceneGraphRefresh()
    const appendables = useMemo(
        () =>
            [...appendableRoot].filter(
                (item) => !hiddenAppendables.has(item) && isTemplate(item)
            ),
        [refresh]
    )

    return (
        <>
            {appendables.map((appendable) => (
                <TreeItem key={appendable.uuid} appendable={appendable} />
            ))}
        </>
    )
}

export default Templates
