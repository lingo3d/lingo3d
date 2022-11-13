import { APPBAR_HEIGHT } from "../../globals"
import TitleBar from "../component/bars/TitleBar"
import TitleBarButton from "../component/bars/TitleBarButton"
import deleteSelected from "../Editor/deleteSelected"
import { useSelectionTarget } from "../states"
import DeleteIcon from "./icons/DeleteIcon"

const PanelAnimations = () => {
    const [selectionTarget] = useSelectionTarget()

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                maxHeight: 200 - APPBAR_HEIGHT
            }}
        >
            <TitleBar title="animations">
                <TitleBarButton
                    disabled={!selectionTarget}
                    onClick={deleteSelected}
                >
                    <DeleteIcon />
                </TitleBarButton>
            </TitleBar>
            <div style={{ overflow: "scroll", flexGrow: 1 }}></div>
        </div>
    )
}

export default PanelAnimations
