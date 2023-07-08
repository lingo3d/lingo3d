import { useEffect } from "preact/hooks"
import { getSceneGraphExpanded } from "../../states/useSceneGraphExpanded"
import useSyncState from "../hooks/useSyncState"
import Appendable from "../../display/core/Appendable"
import MeshAppendable from "../../display/core/MeshAppendable"
import { Signal, useSignal } from "@preact/signals"

export default (manager: Appendable | MeshAppendable) => {
    const expandedSignal: Signal<boolean> = useSignal(false)
    const sceneGraphExpanded = useSyncState(getSceneGraphExpanded)
    useEffect(() => {
        if (
            "$object" in manager &&
            sceneGraphExpanded?.has(manager.$object)
        )
            expandedSignal.value = true
    }, [sceneGraphExpanded, manager])
    return expandedSignal
}
