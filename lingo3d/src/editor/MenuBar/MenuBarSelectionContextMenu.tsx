import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"
import { PointType } from "../../typeGuards/isPoint"

export const menuBarSelectionContextMenuSignal: Signal<PointType | undefined> =
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
