import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import useInitCSS from "../hooks/useInitCSS"

const Retargeter = () => {
    useInitCSS()

    return <div style={{ width: EDITOR_WIDTH + LIBRARY_WIDTH }}></div>
}
export default Retargeter
