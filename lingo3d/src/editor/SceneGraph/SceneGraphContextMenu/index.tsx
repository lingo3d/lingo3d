import { useEffect, useLayoutEffect, useState } from "preact/hooks"
import { onSelectionTarget } from "../../../events/onSelectionTarget"
import ContextMenu from "../../component/ContextMenu"
import useSyncState from "../../hooks/useSyncState"
import { getSelectionTarget } from "../../../states/useSelectionTarget"
import search from "./search"
import { getSelectionNativeTarget } from "../../../states/useSelectionNativeTarget"
import MenuItems from "./MenuItems"
import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import { rightClickPtr } from "../../../pointers/rightClickPtr"

export const sceneGraphContextMenuSignal: Signal<
    | (Point & {
          search?: boolean
          createJoint?: boolean
      })
    | undefined
> = signal(undefined)

const SceneGraphContextMenu = () => {
    const selectionTarget = useSyncState(getSelectionTarget)
    const nativeTarget = useSyncState(getSelectionNativeTarget)

    useEffect(() => {
        const handle = onSelectionTarget(
            () => (sceneGraphContextMenuSignal.value = rightClickPtr[0])
        )
        return () => {
            handle.cancel()
        }
    }, [])

    const [ready, setReady] = useState(false)

    useLayoutEffect(() => {
        setReady(false)
        const timeout = setTimeout(() => setReady(true), 1)

        return () => {
            clearTimeout(timeout)
        }
    }, [selectionTarget, nativeTarget])

    if (!sceneGraphContextMenuSignal.value || !ready) return null

    return (
        <ContextMenu
            positionSignal={sceneGraphContextMenuSignal}
            input={
                sceneGraphContextMenuSignal.value.search &&
                selectionTarget && {
                    label: "Child name",
                    onInput: (value) => search(value, selectionTarget)
                }
            }
        >
            <MenuItems
                selectionTarget={selectionTarget}
                nativeTarget={nativeTarget}
            />
        </ContextMenu>
    )
}

export default SceneGraphContextMenu
