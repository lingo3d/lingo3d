import { useEffect } from "preact/hooks"
import { getSceneGraphExpanded } from "../../states/useSceneGraphExpanded"
import useSyncState from "../hooks/useSyncState"
import Appendable from "../../api/core/Appendable"
import MeshAppendable from "../../api/core/MeshAppendable"
import { Signal, useSignal } from "@preact/signals"

export default (manager: Appendable | MeshAppendable) => {
    const expandedSignal: Signal<boolean> = useSignal(false)
    const sceneGraphExpanded = useSyncState(getSceneGraphExpanded)
    useEffect(() => {
        if (
            "outerObject3d" in manager &&
            sceneGraphExpanded?.has(manager.outerObject3d)
        )
            expandedSignal.value = true
    }, [sceneGraphExpanded, manager])
    return expandedSignal
}
