import Appendable from "../../api/core/Appendable"
import Switch from "../component/Switch"

type ToggleProps = {
    manager: Appendable
}

const Toggle = ({ manager }: ToggleProps) => {
    return <Switch compact />
}

export default Toggle
