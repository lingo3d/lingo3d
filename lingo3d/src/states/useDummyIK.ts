import store, { createEffect } from "@lincode/reactivity"
import DummyIK from "../display/DummyIK"
import { disposeStateSystem } from "../systems/eventSystems/disposeStateSystem"

export const [setDummyIK, getDummyIK] = store<DummyIK | undefined>(undefined)

createEffect(() => {
    const dummyIK = getDummyIK()
    if (!dummyIK) return
    disposeStateSystem.add(dummyIK, { setState: setDummyIK })
    return () => {
        disposeStateSystem.delete(dummyIK)
    }
}, [getDummyIK])
