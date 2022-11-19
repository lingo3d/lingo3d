import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import { useFileCurrent } from "../states"
import useInitCSS from "../utils/useInitCSS"

const Tabs = () => {
    useInitCSS(true)
    const [fileCurrent] = useFileCurrent()

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-tabs"
            style={{ width: "100%" }}
        >
            <AppBar>
                <CloseableTab>{fileCurrent?.name ?? "untitled"}</CloseableTab>
            </AppBar>
        </div>
    )
}
export default Tabs
