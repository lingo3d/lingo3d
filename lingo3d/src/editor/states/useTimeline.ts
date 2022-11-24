import { createEffect } from "@lincode/reactivity"
import Timeline from "../../display/Timeline"
import { onDispose } from "../../events/onDispose"
import preactStore from "../utils/preactStore"

export const [useTimeline, setTimeline, getTimeline] = preactStore<
    Timeline | undefined
>(undefined)

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return

    const handle = onDispose(
        (item) => item === timeline && setTimeline(undefined)
    )
    return () => {
        handle.cancel()
    }
}, [getTimeline])
