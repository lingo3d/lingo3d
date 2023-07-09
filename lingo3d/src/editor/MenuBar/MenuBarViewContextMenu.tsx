import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"
import { PointType } from "../../typeGuards/isPoint"

export const menuBarViewContextMenuSignal: Signal<PointType | undefined> =
    signal(undefined)

const MenuBarViewContextMenu = () => {
    return (
        <ContextMenu positionSignal={menuBarViewContextMenuSignal}>
            <MenuButton>Toggle Split View</MenuButton>
            <MenuButton>Toggle UI Layer</MenuButton>
            <MenuButton>Toggle Expanded</MenuButton>
        </ContextMenu>
    )
}

export default MenuBarViewContextMenu
