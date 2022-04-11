import SimpleObjectManager from "lingo3d/lib/display/core/SimpleObjectManager"
import React, { useContext, useLayoutEffect, useState } from "react"
import useDiffProps from "../../hooks/useDiffProps"
import { applyChanges, ParentContext } from "../../hooks/useManager"
import { ManagerProps } from "../../Props"

const Find = React.forwardRef<SimpleObjectManager, ManagerProps & { onLoad?: () => void }>((p, ref) => {
    const parent = useContext(ParentContext)
    const [manager, setManager] = useState<any>()

    useLayoutEffect(() => {
        const { name } = p
        if (!parent || !name) return

        if ("loadedResolvable" in parent){
            //@ts-ignore
            const handle = parent.loadedResolvable.then(() => {
                setManager(parent.find(name))
                p.onLoad?.()
            })
            return () => {
                handle.cancel()
            }
        }
        setManager(parent.find(name))
        p.onLoad?.()

    }, [parent, p.name])

    const [changed, removed] = useDiffProps(p)
    useLayoutEffect(() => {
        manager && applyChanges(manager, changed, removed)
    }, [manager, changed, removed])

    useLayoutEffect(() => {
        if (!ref || !manager) return

        if (typeof ref === "function")
            ref(manager)
        else
            ref.current = manager
            
    }, [ref, manager])

    return null
})

export default Find
