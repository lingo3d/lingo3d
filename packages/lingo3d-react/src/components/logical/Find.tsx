import FoundManager from "lingo3d/lib/display/core/FoundManager"
import React, { useContext, useLayoutEffect, useState } from "react"
import useDiffProps from "../../hooks/useDiffProps"
import { applyChanges, ParentContext } from "../../hooks/useManager"
import { FoundProps } from "../../Props"

const Find = React.forwardRef<FoundManager, FoundProps & { onLoad?: () => void }>(({ name, onLoad, ...p }, ref) => {
    const parent = useContext(ParentContext)
    const [manager, setManager] = useState<any>()

    useLayoutEffect(() => {
        if (!parent || !name) return

        if ("loadedResolvable" in parent){
            //@ts-ignore
            const handle = parent.loadedResolvable.then(() => setManager(parent.find(name)))
            return () => {
                handle.cancel()
            }
        }
        setManager(parent.find(name))

    }, [parent, name])

    const [changed, removed] = useDiffProps(p, !manager)
    manager && applyChanges(manager, changed, removed)

    useLayoutEffect(() => {
        if (!ref || !manager) return

        if (typeof ref === "function")
            ref(manager)
        else
            ref.current = manager
            
    }, [ref, manager])

    useLayoutEffect(() => {
        manager && onLoad?.()
    }, [manager])

    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Find
