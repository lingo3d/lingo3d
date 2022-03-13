import React, { useContext, useLayoutEffect } from "react"
import { Group as GameGroup } from "lingo3d"
import { ParentContext } from "../../hooks/useManager"
import { ManagerProps } from "../../Props"
import { Resolvable } from "@lincode/promiselikes"
import useDiffProps from "../../hooks/useDiffProps"
import { useMemoOnce } from "@lincode/hooks"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"

const FindAll = React.forwardRef<GameGroup, ManagerProps>((props, ref) => {
    const parent = useContext(ParentContext)
    const found = useMemoOnce(() => new Resolvable<Array<ObjectManager>>())

    useLayoutEffect(() => {
        if (!parent || !props.name) {
            found.resolve([])
            return
        }
        if ("loadedResolvable" in parent) {
            //@ts-ignore
            const handle = parent.loadedResolvable.then(() => found.resolve(parent.findAll(props.name)))
            return () => {
                handle.cancel()
            }
        }
        found.resolve(parent.findAll(props.name))
    }, [])

    const changed = useDiffProps(props)
    found.then(f => {
        for (const [key, value] of changed)
            for (const child of f)
                (child as any)[key] = value
    })
    
    return null
})

export default FindAll