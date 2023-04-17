import { useEffect, useLayoutEffect, useState } from "preact/hooks"
import { onSelectionTarget } from "../../../events/onSelectionTarget"
import ContextMenu from "../../component/ContextMenu"
import useSyncState from "../../hooks/useSyncState"
import { getSelectionTarget } from "../../../states/useSelectionTarget"
import search from "./search"
import MenuItems from "./MenuItems"
import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import { rightClickPtr } from "../../../pointers/rightClickPtr"
import { addSelectionHideId } from "../../../states/useSelectionHideId"

export const sceneGraphContextMenuSignal: Signal<
    | (Point & {
          search?: boolean
          createJoint?: boolean
          hideId?: boolean
      })
    | undefined
> = signal(undefined)

const SceneGraphContextMenu = () => {
    const selectionTarget = useSyncState(getSelectionTarget)

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
    }, [selectionTarget])

    if (!sceneGraphContextMenuSignal.value || !ready) return null

    return (
        <ContextMenu
            positionSignal={sceneGraphContextMenuSignal}
            input={
                sceneGraphContextMenuSignal.value.search && selectionTarget
                    ? {
                          label: "Child name",
                          onInput: (value) => search(value, selectionTarget)
                      }
                    : sceneGraphContextMenuSignal.value.hideId
                    ? {
                          label: "Object id",
                          onInput: addSelectionHideId
                      }
                    : undefined
            }
        >
            <MenuItems selectionTarget={selectionTarget} />
        </ContextMenu>
    )
}

export default SceneGraphContextMenu
