import { useState, useLayoutEffect } from "preact/hooks"
import { onSceneGraphChange } from "../../events/onSceneGraphChange"

export default () => {
    const [refresh, setRefresh] = useState({})
    useLayoutEffect(() => {
        const handle = onSceneGraphChange(() => setRefresh({}))
        return () => {
            handle.cancel()
        }
    }, [])
    return refresh
}
