import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"

export const fileBrowserMaterialContextMenuSignal: Signal<Point | undefined> =
    signal(undefined)

const FileBrowserMaterialContextMenu = () => {
    return (
        <ContextMenu positionSignal={fileBrowserMaterialContextMenuSignal}>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                texture channel
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                metalnessMap channel
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                roughnessMap channel
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                normalMap channel
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                envMap channel
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                aoMap channel
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                alphaMap channel
            </MenuButton>
        </ContextMenu>
    )
}

export default FileBrowserMaterialContextMenu
