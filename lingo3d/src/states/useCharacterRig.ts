import store, { createEffect } from "@lincode/reactivity"
import CharacterRig from "../display/CharacterRig"
import { disposeStateSystem } from "../systems/eventSystems/disposeStateSystem"

export const [setCharacterRig, getCharacterRig] = store<
    CharacterRig | undefined
>(undefined)

createEffect(() => {
    const characterRig = getCharacterRig()
    if (!characterRig) return
    disposeStateSystem.add(characterRig, { setState: setCharacterRig })
    return () => {
        disposeStateSystem.delete(characterRig)
    }
}, [getCharacterRig])
