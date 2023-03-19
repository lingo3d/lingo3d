import { useEffect, useLayoutEffect, useState } from "preact/hooks"
import { onSelectionTarget } from "../../../events/onSelectionTarget"
import ContextMenu from "../../component/ContextMenu"
import useSyncState from "../../hooks/useSyncState"
import { getSelectionTarget } from "../../../states/useSelectionTarget"
import search from "./search"
import { getSelectionNativeTarget } from "../../../states/useSelectionNativeTarget"
import { rightClickPtr } from "../../../api/mouse"
import MenuItems from "./MenuItems"
import sceneGraphMenuSignal from "./sceneGraphMenuSignal"

const SceneGraphContextMenu = () => {
    const selectionTarget = useSyncState(getSelectionTarget)
    const nativeTarget = useSyncState(getSelectionNativeTarget)

    useEffect(() => {
        const handle = onSelectionTarget(
            () => (sceneGraphMenuSignal.value = rightClickPtr[0])
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

    if (!sceneGraphMenuSignal.value || !ready) return null

    return (
        <ContextMenu
            positionSignal={sceneGraphMenuSignal}
            input={
                sceneGraphMenuSignal.value.search &&
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
