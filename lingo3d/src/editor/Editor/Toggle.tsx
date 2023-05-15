import { memo } from "preact/compat"
import Appendable from "../../display/core/Appendable"
import computePerFrame from "../../memo/utils/computePerFrame"
import { getIncludeKeys } from "../../visualScripting/utils/getIncludeKeys"
import Switch from "../component/Switch"
import { forceGetInstance } from "@lincode/utils"
import { runtimeIncludeKeysMap } from "../../collections/runtimeCollections"

type ToggleProps = {
    manager: Appendable
    property: string
}

const getIncludeRecord = computePerFrame((manager: Appendable) => {
    const includeKeys = getIncludeKeys(manager)
    const result: Record<string, boolean> = {}
    for (const key of includeKeys) result[key] = true
    return result
})

const Toggle = memo(
    ({ manager, property }: ToggleProps) => {
        return (
            <Switch
                compact
                on={getIncludeRecord(manager)[property]}
                onChange={(val) => {
                    const runtimeIncludeKeys = forceGetInstance(
                        runtimeIncludeKeysMap,
                        manager,
                        Set
                    )
                    if (val) runtimeIncludeKeys.add(property)
                    else runtimeIncludeKeys.delete(property)
                    manager.$emitEvent("runtimeSchema")
                }}
            />
        )
    },
    () => true
)

export default Toggle
