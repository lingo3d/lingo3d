import { useState, useEffect } from "preact/hooks"
import { getSceneGraphExpanded } from "../../states/useSceneGraphExpanded"
import useSyncState from "../hooks/useSyncState"
import Appendable from "../../api/core/Appendable"
import MeshAppendable from "../../api/core/MeshAppendable"

export default (manager: Appendable | MeshAppendable) => {
    const [expanded, setExpanded] = useState(false)

    const sceneGraphExpanded = useSyncState(getSceneGraphExpanded)
    useEffect(() => {
        "outerObject3d" in manager &&
            sceneGraphExpanded?.has(manager.outerObject3d) &&
            setExpanded(true)
    }, [sceneGraphExpanded])

    return expanded
}
