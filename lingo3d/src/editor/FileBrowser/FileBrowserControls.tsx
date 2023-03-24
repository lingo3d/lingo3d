import IconButton from "../component/IconButton"
import AppBar from "../component/bars/AppBar"
import AddIcon from "./icons/AddIcon"

const FileBrowserControls = () => {
    return (
        <AppBar style={{ gap: 4 }}>
            <IconButton label="create">
                <AddIcon />
            </IconButton>
            <IconButton label="rename" />
            <IconButton label="delete" />
        </AppBar>
    )
}
export default FileBrowserControls
