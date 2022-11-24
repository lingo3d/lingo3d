import { APPBAR_HEIGHT } from "../../globals"
import TitleBar from "../component/bars/TitleBar"
import AppBarButton from "../component/bars/AppBarButton"
import deleteSelected from "../Editor/deleteSelected"
import { useSelectionTarget } from "../states"
import DeleteIcon from "./icons/DeleteIcon"

const AccordionTimelines = () => {
    const [selectionTarget] = useSelectionTarget()

    return (
        <div
            style={{
                maxHeight: 200 - APPBAR_HEIGHT,
                display: "flex",
                flexDirection: "column"
            }}
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
