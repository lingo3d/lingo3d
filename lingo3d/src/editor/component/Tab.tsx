import { ComponentChildren } from "preact"
import CloseIcon from "./icons/CloseIcon"
import TitleBarButton from "./TitleBarButton"

type TabProps = {
    onClose?: () => void
    children?: ComponentChildren
}

const Tab = ({ onClose, children }: TabProps) => {
    return (
        <div
            className="lingo3d-bg"
            style={{
                height: 24,
                display: "flex",
                alignItems: "center"
            }}
        >
            {children}
            <div style={{ width: 4 }} />
            <TitleBarButton onClick={onClose}>
                <CloseIcon />
            </TitleBarButton>
        </div>
    )
}

export default Tab
