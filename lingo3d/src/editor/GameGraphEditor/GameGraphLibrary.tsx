import { useSignal } from "@preact/signals"
import { useEffect } from "preact/hooks"
import { LIBRARY_WIDTH, APPBAR_HEIGHT } from "../../globals"
import Drawer from "../component/Drawer"
import Library from "../Library"
import LibraryIcon from "./icons/LibraryIcon"

const GameGraphLibrary = () => {
    const showSignal = useSignal(true)

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
        >
            <div
                className="lingo3d-flexcenter"
                style={{
                    width: APPBAR_HEIGHT,
                    height: APPBAR_HEIGHT + 8,
                    position: "absolute",
                    marginLeft: -APPBAR_HEIGHT,
                    opacity: 0.75
                }}
                onClick={() => (showSignal.value = !showSignal.value)}
            >
                <LibraryIcon />
            </div>
            <Library onDragStart={() => (showSignal.value = false)} />
        </Drawer>
    )
}

export default GameGraphLibrary
