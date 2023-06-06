import { createPortal, useEffect, useMemo, useState } from "preact/compat"
import ComboBox from "../../component/Combobox"
import { getScriptSystemNames } from "../../../states/useScriptSystemNames"
import useSyncState from "../../hooks/useSyncState"
import { selectionTargetPtr } from "../../../pointers/selectionTargetPtr"
import { systemsMap } from "../../../collections/systemsMap"
import ListItem from "./ListItem"
import { onAfterRender } from "../../../events/onAfterRender"

type Props = {
    systemsFolderElement: HTMLDivElement
}

const SystemsComboList = ({ systemsFolderElement }: Props) => {
    const [_, setRefresh] = useState({})

    const systemNamesRecord = useSyncState(getScriptSystemNames)
    const systemNames = useMemo(() => {
        const systemNames: Array<string> = []
        for (const val of Object.values(systemNamesRecord))
            systemNames.push(...val)
        return systemNames
    }, [systemNamesRecord])

    useEffect(() => {
        let count = selectionTargetPtr[0]?.$systems.size ?? 0
        const handle = onAfterRender(() => {
            const newCount = selectionTargetPtr[0]?.$systems.size ?? 0
            if (newCount === count) return
            count = newCount
            setRefresh({})
        })
        return () => {
            handle.cancel()
        }
    }, [])

    return createPortal(
        <div style={{ width: "100%" }}>
            <ComboBox
                options={systemNames}
                onEnter={(val) =>
                    systemsMap.get(val)!.add(selectionTargetPtr[0])
                }
            />
            <div style={{ opacity: 0.75 }}>
                {selectionTargetPtr[0] &&
                    [...selectionTargetPtr[0].$systems.values()].map(
                        (system) => (
                            <ListItem
                                key={system.name}
                                system={system}
                                disabled={!systemsMap.has(system.name)}
                                onDelete={() =>
                                    systemsMap
                                        .get(system.name)!
                                        .delete(selectionTargetPtr[0])
                                }
                            />
                        )
                    )}
            </div>
        </div>,
        systemsFolderElement
    )
}

export default SystemsComboList
