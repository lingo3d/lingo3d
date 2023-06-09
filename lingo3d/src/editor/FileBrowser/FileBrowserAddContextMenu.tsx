import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"

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
                New scene
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserAddContextMenuSignal.value = undefined
                }}
            >
                New folder
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserAddContextMenuSignal.value = undefined
                }}
            >
                Add file
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserAddContextMenuSignal.value = undefined
                }}
            >
                Add folder
            </MenuButton>
        </ContextMenu>
    )
}

export default FileBrowserAddContextMenu
