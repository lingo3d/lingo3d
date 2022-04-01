import React, { useContext, useLayoutEffect } from "react"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import useDiffProps from "./useDiffProps"
import { useMemoOnce } from "@lincode/hooks"
import SimpleObjectManager from "lingo3d/lib/display/core/SimpleObjectManager"
import { Cancellable } from "@lincode/promiselikes"
import { forceGet } from "@lincode/utils"
import { Reactive } from "@lincode/reactivity"
import { SceneContext } from "../components/display/Scene"

export const ParentContext = React.createContext<ObjectManager | undefined>(undefined)

const handleStore = new WeakMap<SimpleObjectManager, Map<string, Cancellable>>()
const makeHandleMap = () => new Map<string, Cancellable>()

export default (p: React.PropsWithChildren<any>, ref: React.ForwardedRef<any>, ManagerClass: any) => {
    const { children, ...props } = p

    const parent = useContext(ParentContext)
    const scene = useContext(SceneContext)
    
    const manager = useMemoOnce(() => {
        const manager = new ManagerClass()
        parent?.append(manager)
        return manager
        
    }, manager => {
        const handleMap = handleStore.get(manager)
        if (handleMap)
            for (const handle of handleMap.values())
                handle.cancel()

        manager.dispose()
    })

    const [changed, removed] = useDiffProps(props)
    const handleMap = forceGet(handleStore, manager, makeHandleMap)

    for (const [key, value] of changed) {
        handleMap.get(key)?.cancel()

        if (value instanceof Reactive) {
            handleMap.set(key, value.get(v => manager[key] = v))
            continue
        }
        else if (key === "physics" && scene) {
            //@ts-ignore
            handleMap.set(key, scene.loadedResolvable.then(() => manager.physics = value))
            continue
        }
        manager[key] = value
    }
    for (const key of removed)
        manager[key] = manager.constructor.defaults?.[key]

    useLayoutEffect(() => {
        if (!ref) return

        if (typeof ref === "function")
            ref(manager)
        else
            ref.current = manager
    }, [ref])

    return manager
}