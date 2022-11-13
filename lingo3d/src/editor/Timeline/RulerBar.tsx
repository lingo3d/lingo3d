import TitleBarButton from "../component/bars/TitleBarButton"
import DeleteIcon from "../SceneGraph/icons/DeleteIcon"
import FindIcon from "../SceneGraph/icons/FindIcon"
import GroupIcon from "../SceneGraph/icons/GroupIcon"

const RulerBar = () => {
    return (
        <>
            <TitleBarButton>
                <FindIcon />
            </TitleBarButton>
            <TitleBarButton>
                <GroupIcon />
            </TitleBarButton>
            <TitleBarButton>
                <DeleteIcon />
            </TitleBarButton>
        </>
    )
}
export default RulerBar
