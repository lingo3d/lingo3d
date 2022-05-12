import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"

preventTreeShake(h)

type TitleBarButtonProps = {
    children?: JSX.Element
    onClick?: () => void
    active?: boolean
}

const TitleBarButton = ({ children, onClick, active }: TitleBarButtonProps) => {
  return (
    <div onClick={active ? onClick : undefined} style={{
        width: 24,
        height: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 2,
        opacity: active ? 1 : 0.1,
        cursor: active ? "pointer" : "default"
    }}>
        {children}
    </div>
  )
}

export default TitleBarButton
