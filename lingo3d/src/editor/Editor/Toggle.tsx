import { useMemo } from "preact/hooks"
import Appendable, { getIncludeKeys } from "../../api/core/Appendable"
import computePerFrame from "../../utils/computePerFrame"
import Switch from "../component/Switch"

type ToggleProps = {
    manager: Appendable
}

export const getIncludeRecord = computePerFrame((manager: Appendable) => {
    const includeKeys = getIncludeKeys(manager)
    const result: Record<string, boolean> = {}
    for (const key of includeKeys) result[key] = true
    return result
}, false)

const Toggle = ({ manager }: ToggleProps) => {
    const includeRecord = useMemo(() => getIncludeRecord(manager), [manager])

    return <Switch compact />
}

export default Toggle
