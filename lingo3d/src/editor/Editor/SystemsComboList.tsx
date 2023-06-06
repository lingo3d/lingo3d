import { createPortal, useMemo, useState } from "preact/compat"
import ComboBox from "../component/Combobox"
import { getScriptSystemNames } from "../../states/useScriptSystemNames"
import useSyncState from "../hooks/useSyncState"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { systemsMap } from "../../collections/systemsMap"
import MenuButton from "../component/MenuButton"

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

    return createPortal(
        <div style={{ width: "100%" }}>
            <ComboBox
                options={systemNames}
                onEnter={(val) => {
                    systemsMap.get(val)!.add(selectionTargetPtr[0])
                    setRefresh({})
                }}
            />
            <div style={{ opacity: 0.75 }}>
                {selectionTargetPtr[0] &&
                    [...selectionTargetPtr[0].$systems.values()].map(
                        (system) => (
                            <MenuButton key={system.name} compact padding={6}>
                                {system.name}
                            </MenuButton>
                        )
                    )}
            </div>
        </div>,
        systemsFolderElement
    )
}

export default SystemsComboList
