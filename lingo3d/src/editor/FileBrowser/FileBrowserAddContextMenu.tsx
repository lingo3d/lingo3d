import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"
import createFolder from "../../api/files/createFolder"

export const fileBrowserAddContextMenuSignal: Signal<Point | undefined> =
    signal(undefined)

const FileBrowserAddContextMenu = () => {
    return (
        <ContextMenu positionSignal={fileBrowserAddContextMenuSignal}>
            <MenuButton
                onClick={() => {
                    fileBrowserAddContextMenuSignal.value = undefined
                }}
            >
                New File
            </MenuButton>
            <MenuButton
                onClick={() => {
                    createFolder()
                    fileBrowserAddContextMenuSignal.value = undefined
                }}
            >
                New Folder
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserAddContextMenuSignal.value = undefined
                }}
            >
                Upload File
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserAddContextMenuSignal.value = undefined
                }}
            >
                Upload Folder
            </MenuButton>
        </ContextMenu>
    )
}

export default FileBrowserAddContextMenu
