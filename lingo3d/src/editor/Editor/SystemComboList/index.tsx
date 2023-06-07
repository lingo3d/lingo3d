import { createPortal, useEffect, useMemo, useState } from "preact/compat"
import ComboBox from "../../component/Combobox"
import { selectionTargetPtr } from "../../../pointers/selectionTargetPtr"
import { systemsMap } from "../../../collections/systemsMap"
import ListItem from "./ListItem"
import { onAfterRender } from "../../../events/onAfterRender"
import { scriptUUIDSystemNamesMap } from "../../../collections/scriptUUIDSystemNamesMap"

type Props = {
    systemsFolderElement: HTMLDivElement
}

const SystemsComboList = ({ systemsFolderElement }: Props) => {
    const [_, setRefresh] = useState({})

    const systemNames = useMemo(() => {
        const systemNames: Array<string> = []
        for (const val of scriptUUIDSystemNamesMap.values())
            systemNames.push(...val)
        return systemNames
    }, [])

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
                placeholder="Search systems..."
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
