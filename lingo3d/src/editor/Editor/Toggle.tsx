import { useMemo } from "preact/hooks"
import Appendable, { getIncludeKeys } from "../../api/core/Appendable"
import Switch from "../component/Switch"

type ToggleProps = {
    manager: Appendable
}

const Toggle = ({ manager }: ToggleProps) => {
    const includeKeys = useMemo(() => getIncludeKeys(manager), [manager])

    return <Switch compact />
}

export default Toggle
