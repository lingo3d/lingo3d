import { debounce } from "@lincode/utils"
import { Object3D } from "three"
import scene from "../../../../engine/scene"
import { getSelectionFrozen } from "../../../../states/useSelectionFrozen"

const selectionCandidates = new Set<Object3D>()
export default selectionCandidates

export const getSelectionCandidates = debounce(
    () => {
        const [frozenSet] = getSelectionFrozen()

        selectionCandidates.clear()
        scene.traverse((c) => {
            const { manager } = c.userData
            manager &&
                !frozenSet.has(manager) &&
                selectionCandidates.add(manager.nativeObject3d)
        })
    },
    0,
    "trailing"
)
