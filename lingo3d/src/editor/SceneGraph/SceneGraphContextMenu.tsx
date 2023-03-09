import { useEffect, useLayoutEffect, useState } from "preact/hooks"
import { onSelectionTarget } from "../../events/onSelectionTarget"
import ContextMenu from "../component/ContextMenu"
import mousePosition from "../utils/mousePosition"
import useSyncState from "../hooks/useSyncState"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import search from "./utils/search"
import { getSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import { rightClickPtr } from "../../api/mouse"
import { Position } from "./MenuItems/Position"
import MenuItems from "./MenuItems"
import { useSignal } from "@preact/signals"

const SceneGraphContextMenu = () => {
    const positionSignal = useSignal<Position | undefined>(undefined)
    const selectionTarget = useSyncState(getSelectionTarget)
    const nativeTarget = useSyncState(getSelectionNativeTarget)

    useEffect(() => {
        const handle = onSelectionTarget(
            () => rightClickPtr[0] && (positionSignal.value = mousePosition)
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

    if (!positionSignal.value || !ready) return null

    return (
        <ContextMenu
            positionSignal={positionSignal}
            input={positionSignal.value.search && "Child name"}
            onInput={(value) =>
                positionSignal.value?.search &&
                selectionTarget &&
                search(value, selectionTarget)
            }
        >
            <MenuItems
                positionSignal={positionSignal}
                selectionTarget={selectionTarget}
                nativeTarget={nativeTarget}
            />
        </ContextMenu>
    )
}

export default SceneGraphContextMenu
