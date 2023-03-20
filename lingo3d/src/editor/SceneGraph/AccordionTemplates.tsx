import TitleBar from "../component/bars/TitleBar"
import TreeItem from "./TreeItem"
import Appendable from "../../api/core/Appendable"

type Props = {
    appendables: Array<Appendable>
}

const AccordionTemplates = ({ appendables }: Props) => {
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
