import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import useInitCSS from "../hooks/useInitCSS"
import useSyncState from "../hooks/useSyncState"
import { getFileCurrent } from "../../states/useFileCurrent"
import IconButton from "../component/IconButton"
import PlayIcon from "../TimelineEditor/icons/PlayIcon"
import PauseIcon from "../TimelineEditor/icons/PauseIcon"

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
                <div style={{ flexGrow: 1, minWidth: 4 }} />
                <IconButton fill>
                    <PlayIcon />
                </IconButton>
                <IconButton fill disabled>
                    <PauseIcon />
                </IconButton>
            </AppBar>
        </div>
    )
}
export default Tabs
