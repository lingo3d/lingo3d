import { memo } from "preact/compat"
import { sceneGraphContextMenuSignal } from ".."
import { componentNameMenuButtonMap } from "../../../../collections/componentNameMenuButtonMap"
import { selectionTargetPtr } from "../../../../pointers/selectionTargetPtr"
import MenuButton from "../../../component/MenuButton"
import {
    getCharacterRig,
    setCharacterRig
} from "../../../../states/useCharacterRig"
import { returnTrue } from "../../../../display/utils/reusables"

componentNameMenuButtonMap.set(
    "characterRig",
    memo(() => {
        const selectionTarget = selectionTargetPtr[0] as any
        const characterRig = getCharacterRig()

        return (
            <MenuButton
                disabled={selectionTarget === characterRig}
                onClick={() => {
                    setCharacterRig(selectionTarget)
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                {selectionTarget === characterRig
                    ? "Already editing"
                    : "Edit CharacterRig"}
            </MenuButton>
        )
    }, returnTrue)
)
