import { useMemo } from "preact/hooks"
import Template, { isTemplate } from "../../display/Template"
import useSceneGraphRefresh from "../hooks/useSceneGraphRefresh"
import TemplatesTreeItem from "./TemplatesTreeItem"
import { appendableRoot } from "../../collections/appendableRoot"
import { hiddenAppendables } from "../../collections/hiddenAppendables"

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
