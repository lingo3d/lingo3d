import register from "preact-custom-element"
import CloseableTab from "../component/CloseableTab"
import AppBar from "../component/AppBar"
import useInitCSS from "../utils/useInitCSS"
import { useFileBrowser } from "../states"
import FileBrowser from "../FileBrowser"

const Panels = () => {
    useInitCSS(true)

    const [fileBrowser] = useFileBrowser()

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels"
            style={{
                height: 200,
                width: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <AppBar>
                <CloseableTab>timeline</CloseableTab>
                <CloseableTab disabled={!fileBrowser}>files</CloseableTab>
            </AppBar>
            <div style={{ flexGrow: 1 }}>{fileBrowser && <FileBrowser />}</div>
        </div>
    )
}
export default Panels

register(Panels, "lingo3d-panels")
