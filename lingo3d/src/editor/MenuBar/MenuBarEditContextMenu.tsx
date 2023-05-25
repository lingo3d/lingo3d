import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"

export const menuBarEditContextMenuSignal: Signal<Point | undefined> =
    signal(undefined)

const MenuBarEditContextMenu = () => {
    return (
        <ContextMenu positionSignal={menuBarEditContextMenuSignal}>
            <MenuButton>Undo</MenuButton>
            <MenuButton>Redo</MenuButton>
            <MenuButton>Duplicate</MenuButton>
            <MenuButton>Delete</MenuButton>
            <MenuButton>Select All</MenuButton>
        </ContextMenu>
    )
}

export default MenuBarEditContextMenu
