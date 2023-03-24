import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"
import createJSON from "../../api/files/createJSON"

export const fileBrowserContextMenuSignal: Signal<Point | undefined> =
    signal(undefined)

const FileBrowserContextMenu = () => {
    return (
        <ContextMenu positionSignal={fileBrowserContextMenuSignal}>
            <MenuButton
                onClick={() => {
                    createJSON()
                    fileBrowserContextMenuSignal.value = undefined
                }}
            >
                New scene
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserContextMenuSignal.value = undefined
                }}
            >
                Existing files
            </MenuButton>
        </ContextMenu>
    )
}

export default FileBrowserContextMenu
