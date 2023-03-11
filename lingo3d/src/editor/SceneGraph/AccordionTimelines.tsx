import { APPBAR_HEIGHT } from "../../globals"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import TitleBar from "../component/bars/TitleBar"
import AppBarButton from "../component/AppBarButton"
import deleteSelected from "../../engine/hotkeys/deleteSelected"
import useSyncState from "../hooks/useSyncState"
import DeleteIcon from "./icons/DeleteIcon"

const AccordionTimelines = () => {
    const selectionTarget = useSyncState(getSelectionTarget)

    return (
        <div
            className="lingo3d-flexcol"
            style={{ maxHeight: 200 - APPBAR_HEIGHT }}
        >
            <TitleBar title="timelines">
                <AppBarButton
                    disabled={!selectionTarget}
                    onClick={deleteSelected}
                >
                    <DeleteIcon />
                </AppBarButton>
            </TitleBar>
            <div style={{ overflow: "scroll", flexGrow: 1 }}></div>
        </div>
    )
}

export default AccordionTimelines
