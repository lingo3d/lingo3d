import { useSignal } from "@preact/signals"
import { useEffect, useRef } from "preact/hooks"
import createObject from "../../api/serializer/createObject"
import { GameObjectType } from "../../api/serializer/types"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { LIBRARY_WIDTH, APPBAR_HEIGHT } from "../../globals"
import Drawer from "../component/Drawer"
import Library from "../Library"
import LibraryIcon from "./icons/LibraryIcon"
import { draggingItemPtr } from "../../pointers/draggingItemPtr"

const GameGraphLibrary = () => {
    const showSignal = useSignal(true)
    const draggingName = useRef<GameObjectType>()

    useEffect(() => {
        const timeout = setTimeout(() => {
            showSignal.value = false
        }, 500)

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    return (
        <Drawer
            width={LIBRARY_WIDTH}
            anchor="right"
            show={showSignal.value}
            onHide={() => (showSignal.value = false)}
            onDragOverMask={() => {
                if (!draggingName.current) return
                showSignal.value = false
                emitSelectionTarget(
                    (draggingItemPtr[0] = createObject(draggingName.current))
                )
            }}
        >
            <div
                className="lingo3d-flexcenter"
                style={{
                    width: APPBAR_HEIGHT,
                    height: APPBAR_HEIGHT + 8,
                    position: "absolute",
                    marginLeft: -APPBAR_HEIGHT,
                    opacity: 0.75,
                    cursor: "pointer"
                }}
                onClick={() => (showSignal.value = !showSignal.value)}
            >
                <LibraryIcon />
            </div>
            <Library
                onDragStart={(name) => (draggingName.current = name)}
                onDragEnd={() => {
                    draggingName.current = undefined
                    draggingItemPtr[0] = undefined
                }}
            />
        </Drawer>
    )
}

export default GameGraphLibrary
