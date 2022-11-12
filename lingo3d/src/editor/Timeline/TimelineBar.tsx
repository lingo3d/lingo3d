import TitleBarButton from "../component/bars/TitleBarButton"
import DeleteIcon from "../SceneGraph/icons/DeleteIcon"
import FindIcon from "../SceneGraph/icons/FindIcon"
import GroupIcon from "../SceneGraph/icons/GroupIcon"

const TimelineBar = () => {
    return (
        <div style={{ display: "flex" }}>
            <TitleBarButton>
                <FindIcon />
            </TitleBarButton>
            <TitleBarButton>
                <GroupIcon />
            </TitleBarButton>
            <TitleBarButton>
                <DeleteIcon />
            </TitleBarButton>
        </div>
    )
}
export default TimelineBar
