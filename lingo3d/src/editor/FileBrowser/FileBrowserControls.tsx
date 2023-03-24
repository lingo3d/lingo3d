import IconButton from "../component/IconButton"
import PlayIcon from "../component/icons/PlayIcon"
import PauseIcon from "../component/icons/PauseIcon"
import AppBar from "../component/bars/AppBar"

const FileBrowserControls = () => {
    return (
        <AppBar noPadding>
            <IconButton fill>
                <PlayIcon />
            </IconButton>
            <IconButton fill>
                <PauseIcon />
            </IconButton>
        </AppBar>
    )
}
export default FileBrowserControls
