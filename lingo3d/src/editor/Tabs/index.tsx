import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import useInitCSS from "../hooks/useInitCSS"
import useSyncState from "../hooks/useSyncState"
import { getFileCurrent } from "../../states/useFileCurrent"

const Tabs = () => {
    useInitCSS(true)
    const fileCurrent = useSyncState(getFileCurrent)

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
