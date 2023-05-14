import store, { createEffect } from "@lincode/reactivity"
import DummyIK from "../display/DummyIK"
import {
    addClearStateSystem,
    deleteClearStateSystem
} from "../systems/eventSystems/clearStateSystem"

export const [setDummyIK, getDummyIK] = store<DummyIK | undefined>(undefined)

createEffect(() => {
    const dummyIK = getDummyIK()
    if (!dummyIK) return
    addClearStateSystem(dummyIK, { setState: setDummyIK })
    return () => {
        deleteClearStateSystem(dummyIK)
    }
}, [getDummyIK])
