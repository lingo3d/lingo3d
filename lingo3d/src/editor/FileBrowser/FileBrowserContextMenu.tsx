import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"
import createFile from "../../api/files/createFile"

export const fileBrowserContextMenuSignal: Signal<Point | undefined> =
    signal(undefined)

const FileBrowserContextMenu = () => {
    return (
        <ContextMenu positionSignal={fileBrowserContextMenuSignal}>
            <MenuButton
                onClick={() => {
                    createFile()
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
