import IconButton from "../component/IconButton"
import AppBar from "../component/bars/AppBar"
import AddIcon from "./icons/AddIcon"
import RenameIcon from "./icons/RenameIcon"
import DeleteIcon from "./icons/DeleteIcon"

const FileBrowserControls = () => {
    return (
        <AppBar style={{ gap: 4 }}>
            <IconButton label="create">
                <AddIcon />
            </IconButton>
            <IconButton label="rename">
                <RenameIcon />
            </IconButton>
            <IconButton label="delete">
                <DeleteIcon />
            </IconButton>
        </AppBar>
    )
}
export default FileBrowserControls
