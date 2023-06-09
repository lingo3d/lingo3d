import IconButton from "../component/IconButton"
import AppBar from "../component/bars/AppBar"
import AddIcon from "./icons/AddIcon"
import RenameIcon from "./icons/RenameIcon"
import DeleteIcon from "./icons/DeleteIcon"
import useSyncState from "../hooks/useSyncState"
import { getFileSelected } from "../../states/useFileSelected"
import deleteFile from "../../api/files/deleteFile"
import { fileBrowserAddContextMenuSignal } from "./FileBrowserAddContextMenu"

const FileBrowserControls = () => {
    const fileSelected = useSyncState(getFileSelected)

    return (
        <AppBar style={{ gap: 4 }}>
            <IconButton
                label="add"
                onClick={(e) =>
                    (fileBrowserAddContextMenuSignal.value = {
                        x: e.clientX,
                        y: e.clientY
                    })
                }
            >
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
