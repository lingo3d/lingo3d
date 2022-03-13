import React, { useContext, useLayoutEffect } from "react"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import useDiffProps from "./useDiffProps"
import { useMemoOnce } from "@lincode/hooks"
import SimpleObjectManager from "lingo3d/lib/display/core/SimpleObjectManager"
import { Cancellable } from "@lincode/promiselikes"
import { forceGet } from "@lincode/utils"
import { isGlobalState } from "@lincode/reactivity"
import { SceneContext } from "../components/display/Scene"

export const ParentContext = React.createContext<ObjectManager | undefined>(undefined)

const handleStore = new WeakMap<SimpleObjectManager, Map<string, Cancellable>>()

export default (p: React.PropsWithChildren<any>, ref: React.ForwardedRef<any>, ManagerClass: any) => {
    const { children, ...props } = p

    const parent = useContext(ParentContext)
    const scene = useContext(SceneContext)
    
    const manager = useMemoOnce(() => {
        const manager = new ManagerClass()
        parent?.append(manager)
        return manager
    })

    const changed = useDiffProps(props)
    for (const [key, value] of changed) {
        const handleMap = forceGet(handleStore, manager, () => new Map<string, Cancellable>())
        handleMap.get(key)?.cancel()

        if (isGlobalState<number>(value)) {
            handleMap.set(key, value(v => manager[key] = v))
            continue
        }
        else if (key === "physics" && scene) {
            //@ts-ignore
            handleMap.set(key, scene.loadedResolvable.then(() => manager.physics = value))
            continue
        }
        manager[key] = value
    }

    useLayoutEffect(() => {
        return () => {
            const handleMap = handleStore.get(manager)
            if (handleMap)
                for (const handle of handleMap.values())
                    handle.cancel()

            manager.dispose()
        }
    }, [])

    useLayoutEffect(() => {
        if (!ref) return

        if (typeof ref === "function")
            ref(manager)
        else
            ref.current = manager
    }, [ref])

    return manager
}