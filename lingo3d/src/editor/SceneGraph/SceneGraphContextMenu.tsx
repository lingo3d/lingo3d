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

const SceneGraphContextMenu = () => {
    const [position, setPosition] = useState<Position>()
    const selectionTarget = useSyncState(getSelectionTarget)
    const nativeTarget = useSyncState(getSelectionNativeTarget)

    useEffect(() => {
        const handle = onSelectionTarget(
            () => rightClickPtr[0] && setPosition(mousePosition)
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

    if (!position || !ready) return null

    return (
        <ContextMenu
            position={position}
            setPosition={setPosition}
            input={position.search && "Child name"}
            onInput={(value) =>
                position.search &&
                selectionTarget &&
                search(value, selectionTarget)
            }
        >
            <MenuItems
                position={position}
                setPosition={setPosition}
                selectionTarget={selectionTarget}
                nativeTarget={nativeTarget}
            />
        </ContextMenu>
    )
}

export default SceneGraphContextMenu
