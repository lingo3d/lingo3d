import { APPBAR_HEIGHT } from "../../globals"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import TitleBar from "../component/bars/TitleBar"
import IconButton from "../component/IconButton"
import deleteSelected from "../Editor/deleteSelected"
import useSyncState from "../hooks/useSyncState"
import DeleteIcon from "./icons/DeleteIcon"

const AccordionTimelines = () => {
    const selectionTarget = useSyncState(getSelectionTarget)

    return (
        <div
            style={{
                maxHeight: 200 - APPBAR_HEIGHT,
                display: "flex",
                flexDirection: "column"
            }}
        >
            <TitleBar title="timelines">
                <IconButton
                    disabled={!selectionTarget}
                    onClick={deleteSelected}
                >
                    <DeleteIcon />
                </IconButton>
            </TitleBar>
            <div style={{ overflow: "scroll", flexGrow: 1 }}></div>
        </div>
    )
}

export default AccordionTimelines
