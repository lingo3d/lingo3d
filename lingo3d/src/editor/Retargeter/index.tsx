import { EDITOR_WIDTH } from "../../globals"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"

const Retargeter = () => {
    useInitCSS()
    useInitEditor()

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcenter"
            style={{ width: EDITOR_WIDTH }}
        >
            <div
                className="lingo3d-absfull"
                style={{
                    backgroundImage: "url(retargeter.png)",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    opacity: 0.2
                }}
            />
        </div>
    )
}
export default Retargeter
