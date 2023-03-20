import { useMemo } from "preact/hooks"
import { appendableRoot, hiddenAppendables } from "../../api/core/collections"
import Template, { isTemplate } from "../../display/Template"
import useSceneGraphRefresh from "../hooks/useSceneGraphRefresh"
import TemplatesTreeItem from "./TemplatesTreeItem"

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
                <TemplatesTreeItem
                    key={appendable.uuid}
                    template={appendable as Template}
                />
            ))}
        </>
    )
}

export default Templates
