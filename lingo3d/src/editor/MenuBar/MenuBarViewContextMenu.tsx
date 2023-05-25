import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"

export const menuBarViewContextMenuSignal: Signal<Point | undefined> =
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
