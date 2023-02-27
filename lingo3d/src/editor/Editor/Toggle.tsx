import { memo } from "preact/compat"
import Appendable from "../../api/core/Appendable"
import computePerFrame from "../../utils/computePerFrame"
import { getIncludeKeys } from "../../visualScripting/utils/getIncludeKeys"
import Switch from "../component/Switch"

type ToggleProps = {
    manager: Appendable
    property: string
}

const getIncludeRecord = computePerFrame((manager: Appendable) => {
    const includeKeys = getIncludeKeys(manager)
    const result: Record<string, boolean> = {}
    for (const key of includeKeys) result[key] = true
    return result
}, false)

const Toggle = memo(
    ({ manager, property }: ToggleProps) => {
        return (
            <Switch
                compact
                on={getIncludeRecord(manager)[property]}
                onChange={(val) => {
                    const runtimeIncludeKeys = (manager.runtimeIncludeKeys ??=
                        [])
                    if (val)
                        !runtimeIncludeKeys.includes(property) &&
                            runtimeIncludeKeys.push(property)
                    else
                        manager.runtimeIncludeKeys = runtimeIncludeKeys.filter(
                            (key) => key !== property
                        )
                    manager.propertyChangedEvent.emit("runtimeSchema")
                }}
            />
        )
    },
    () => true
)

export default Toggle
