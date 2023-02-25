import { Signal } from "@preact/signals"
import { LIBRARY_WIDTH, APPBAR_HEIGHT } from "../../globals"
import Library from "../Library"
import LibraryIcon from "./icons/LibraryIcon"

type GameGraphLibraryProps = {
    showSignal: Signal<boolean>
}

const GameGraphLibrary = ({ showSignal }: GameGraphLibraryProps) => {
    return (
        <div
            style={{
                height: "100%",
                width: LIBRARY_WIDTH,
                position: "absolute",
                right: 0,
                transition: "transform 500ms",
                transform: `translateX(${showSignal.value ? 0 : 100}%)`
            }}
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
            <Library />
        </div>
    )
}

export default GameGraphLibrary
