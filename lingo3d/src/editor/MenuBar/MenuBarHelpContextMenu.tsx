import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"
import { VERSION } from "../../globals"
import { PointType } from "../../typeGuards/isPoint"

export const menuBarHelpContextMenuSignal: Signal<PointType | undefined> =
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
