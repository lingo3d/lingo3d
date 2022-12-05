import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import useInitCSS from "../hooks/useInitCSS"
import useSyncState from "../hooks/useSyncState"
import { getFileCurrent } from "../../states/useFileCurrent"

const Tabs = () => {
    useInitCSS()
    const fileCurrent = useSyncState(getFileCurrent)
    const title = fileCurrent?.name ?? "untitled"

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-tabs"
            style={{ width: "100%" }}
        >
            <AppBar>
                <CloseableTab key={title} selected>
                    {title}
                </CloseableTab>
            </AppBar>
        </div>
    )
}
export default Tabs
