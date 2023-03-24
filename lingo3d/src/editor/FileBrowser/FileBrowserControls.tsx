import IconButton from "../component/IconButton"
import AppBar from "../component/bars/AppBar"
import AddIcon from "./icons/AddIcon"
import RenameIcon from "./icons/RenameIcon"
import DeleteIcon from "./icons/DeleteIcon"
import useSyncState from "../hooks/useSyncState"
import { getFileSelected } from "../../states/useFileSelected"
import createJSON from "../../api/files/createJSON"
import deleteFile from "../../api/files/deleteFile"

const FileBrowserControls = () => {
    const fileSelected = useSyncState(getFileSelected)

    return (
        <AppBar style={{ gap: 4 }}>
            <IconButton label="create" onClick={createJSON}>
                <AddIcon />
            </IconButton>
            <IconButton label="rename" disabled={!fileSelected}>
                <RenameIcon />
            </IconButton>
            <IconButton
                label="delete"
                disabled={!fileSelected}
                onClick={deleteFile}
            >
                <DeleteIcon />
            </IconButton>
        </AppBar>
    )
}
export default FileBrowserControls
