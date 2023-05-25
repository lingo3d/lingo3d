import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"
import { VERSION } from "../../globals"

export const menuBarHelpContextMenuSignal: Signal<Point | undefined> =
    signal(undefined)

const MenuBarHelpContextMenu = () => {
    return (
        <ContextMenu positionSignal={menuBarHelpContextMenuSignal}>
            <MenuButton>{`Version ${VERSION}`}</MenuButton>
            <MenuButton>Welcome</MenuButton>
            <MenuButton>Documentation</MenuButton>
            <MenuButton>Forum</MenuButton>
        </ContextMenu>
    )
}

export default MenuBarHelpContextMenu
