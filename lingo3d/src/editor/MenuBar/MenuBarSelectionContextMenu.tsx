import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"

export const menuBarSelectionContextMenuSignal: Signal<Point | undefined> =
    signal(undefined)

const MenuBarSelectionContextMenu = () => {
    return (
        <ContextMenu positionSignal={menuBarSelectionContextMenuSignal}>
            <MenuButton>Hide Selected</MenuButton>
            <MenuButton>Hide Unselected</MenuButton>
            <MenuButton>Unhide All</MenuButton>
            <MenuButton>Focus Camera on Selected</MenuButton>
        </ContextMenu>
    )
}

export default MenuBarSelectionContextMenu
