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
                texture
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                metalnessMap
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                roughnessMap
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                normalMap
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                envMap
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                aoMap
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                alphaMap
            </MenuButton>
        </ContextMenu>
    )
}

export default FileBrowserMaterialContextMenu
