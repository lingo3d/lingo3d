import { memo } from "preact/compat"
import Appendable, { getIncludeKeys } from "../../api/core/Appendable"
import computePerFrame from "../../utils/computePerFrame"
import Switch from "../component/Switch"

type ToggleProps = {
    manager: Appendable
    property: string
}

const getIncludeRecord = computePerFrame((manager: Appendable) => {
    const includeKeys = getIncludeKeys(manager)
    const result: Record<string, boolean> = {}
    for (const key of includeKeys) result[key] = true

    console.log("getIncludeRecord")

    return result
}, false)

const Toggle = memo(
    ({ manager, property }: ToggleProps) => {
        return (
            <Switch
                compact
                on={getIncludeRecord(manager)[property]}
                onChange={(val) => {
                    if (val)
                        !manager.runtimeIncludeKeys!.includes(property) &&
                            manager.runtimeIncludeKeys!.push(property)
                    else
                        manager.runtimeIncludeKeys =
                            manager.runtimeIncludeKeys!.filter(
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
