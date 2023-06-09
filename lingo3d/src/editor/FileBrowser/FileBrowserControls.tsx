import IconButton from "../component/IconButton"
import AppBar from "../component/bars/AppBar"
import AddIcon from "./icons/AddIcon"
import RenameIcon from "./icons/RenameIcon"
import DeleteIcon from "./icons/DeleteIcon"
import useSyncState from "../hooks/useSyncState"
import { getFileSelected } from "../../states/useFileSelected"
import deleteFile from "../../api/files/deleteFile"

const uploadFolder = async () => {

}

const FileBrowserControls = () => {
    const fileSelected = useSyncState(getFileSelected)

    return (
        <AppBar style={{ gap: 4 }}>
            <IconButton label="upload" onClick={uploadFolder}>
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
