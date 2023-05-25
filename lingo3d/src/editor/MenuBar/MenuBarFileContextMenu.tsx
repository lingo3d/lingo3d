import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"

export const menuBarFileContextMenuSignal: Signal<Point | undefined> =
    signal(undefined)

const MenuBarFileContextMenu = () => {
    return (
        <ContextMenu positionSignal={menuBarFileContextMenuSignal}>
            <MenuButton>New File</MenuButton>
            <MenuButton>New Scene File</MenuButton>
            <MenuButton>New TypeScript File</MenuButton>
            <MenuButton>Open</MenuButton>
            <MenuButton>Open Folder</MenuButton>
            <MenuButton>Save</MenuButton>
            <MenuButton>Save As</MenuButton>
        </ContextMenu>
    )
}

export default MenuBarFileContextMenu
