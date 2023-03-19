import { useMemo } from "preact/hooks"
import { appendableRoot, hiddenAppendables } from "../../api/core/collections"
import TitleBar from "../component/bars/TitleBar"
import TreeItem from "./TreeItem"
import useSceneGraphRefresh from "../hooks/useSceneGraphRefresh"
import { isTemplate } from "../../display/Template"

const AccordionTemplates = () => {
    const refresh = useSceneGraphRefresh()
    const appendables = useMemo(
        () =>
            [...appendableRoot].filter(
                (item) => !hiddenAppendables.has(item) && isTemplate(item)
            ),
        [refresh]
    )

    return (
        <div className="lingo3d-absfull lingo3d-flexcol">
            <TitleBar title="templates" />
            <div style={{ overflow: "scroll", flexGrow: 1 }}>
                {appendables.map((appendable) => (
                    <TreeItem key={appendable.uuid} appendable={appendable} />
                ))}
            </div>
        </div>
    )
}

export default AccordionTemplates
