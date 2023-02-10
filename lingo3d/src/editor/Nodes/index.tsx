import { NODES_WIDTH } from "../../globals"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"

const Nodes = () => {
    useInitCSS()
    useInitEditor()

    return (
        <>
            <div
                className="lingo3d-ui lingo3d-bg lingo3d-editor"
                style={{ width: NODES_WIDTH }}
            >
                
            </div>
        </>
    )
}
export default Nodes
