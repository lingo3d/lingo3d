import store, { createEffect } from "@lincode/reactivity"
import DummyIK from "../display/DummyIK"
import {
    addDisposeStateSystem,
    deleteDisposeStateSystem
} from "../systems/eventSystems/disposeStateSystem"

export const [setDummyIK, getDummyIK] = store<DummyIK | undefined>(undefined)

createEffect(() => {
    const dummyIK = getDummyIK()
    if (!dummyIK) return
    addDisposeStateSystem(dummyIK, { setState: setDummyIK })
    return () => {
        deleteDisposeStateSystem(dummyIK)
    }
}, [getDummyIK])
