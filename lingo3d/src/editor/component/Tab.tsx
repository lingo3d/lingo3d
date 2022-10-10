import { createContext } from "preact"
import { useContext } from "preact/hooks"
import CloseIcon from "./icons/CloseIcon"
import TitleBarButton from "./TitleBarButton"

type TabProps = {
    onClose?: () => void
    children?: string
}

export const TabContext = createContext<{
    selected?: string
    setSelected?: (val: string | undefined) => void
}>({})

const Tab = ({ onClose, children }: TabProps) => {
    const context = useContext(TabContext)

    return (
        <div
            className="lingo3d-bg"
            style={{
                height: 24,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                background:
                    context.selected === children
                        ? "rgba(255, 255, 255, 0.1)"
                        : undefined
            }}
            onClick={() => context.setSelected?.(children)}
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
