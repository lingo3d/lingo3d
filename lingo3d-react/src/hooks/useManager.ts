import React, { useContext, useLayoutEffect } from "react"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import useDiffProps from "./useDiffProps"
import { useMemoOnce } from "@lincode/hooks"
import SimpleObjectManager from "lingo3d/lib/display/core/SimpleObjectManager"
import { Cancellable } from "@lincode/promiselikes"
import { forceGet } from "@lincode/utils"
import { Reactive } from "@lincode/reactivity"
import Loaded from "lingo3d/lib/display/core/Loaded"

export const ParentContext = React.createContext<ObjectManager | Loaded | undefined>(undefined)

const handleStore = new WeakMap<SimpleObjectManager, Map<string, Cancellable>>()
const makeHandleMap = () => new Map<string, Cancellable>()

const defaultsMap = new WeakMap<any, any>()

export const applyChanges = (manager: any, changed: Array<[string, any]>, removed: Array<string>) => {
    const handleMap = forceGet(handleStore, manager, makeHandleMap)

    for (const [key, value] of changed) {
        handleMap.get(key)?.cancel()

        if (value instanceof Reactive) {
            handleMap.set(key, value.get(v => manager[key] = v))
            continue
        }
        manager[key] = value
    }

    if (!removed.length) return

    const defaults = forceGet(defaultsMap, manager.constructor.defaults, () => {
        const result: any = {}
        for (const [key, value] of Object.entries(manager.constructor.defaults))
            result[key] = Array.isArray(value) ? value[0] : value

        return result
    })
    for (const key of removed) {
        handleMap.get(key)?.cancel()
        manager[key] = defaults[key]
    }
}

const appendedSet = new WeakSet<any>()

export default (p: React.PropsWithChildren<any>, ref: React.ForwardedRef<any>, ManagerClass: any) => {
    const { children, ...props } = p

    const parent = useContext(ParentContext)
    
    const manager = useMemoOnce(() => {
        const manager = new ManagerClass()
        if (parent) {
            parent.append(manager)
            appendedSet.add(manager)
        }
        return manager
        
    }, manager => {
        const handleMap = handleStore.get(manager)
        if (handleMap)
            for (const handle of handleMap.values())
                handle.cancel()

        manager.dispose()
    })

    useLayoutEffect(() => {
        if (!parent || appendedSet.has(manager)) return
        parent.append(manager)
        appendedSet.add(manager)
    }, [parent])

    const [changed, removed] = useDiffProps(props)
    applyChanges(manager, changed, removed)    

    useLayoutEffect(() => {
        if (!ref) return

        if (typeof ref === "function")
            ref(manager)
        else
            ref.current = manager
    }, [ref])

    return manager
}