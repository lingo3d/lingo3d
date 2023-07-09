import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"
import { TextureType } from "./FileButton"
import { PointType } from "../../typeGuards/isPoint"

export const fileBrowserMaterialContextMenuSignal: Signal<
    (PointType & { onSelect: (channel: TextureType) => void }) | undefined
> = signal(undefined)

const FileBrowserMaterialContextMenu = () => {
    return (
        <ContextMenu positionSignal={fileBrowserMaterialContextMenuSignal}>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value!.onSelect(
                        "texture"
                    )
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                texture
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value!.onSelect(
                        "metalnessMap"
                    )
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                metalnessMap
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value!.onSelect(
                        "roughnessMap"
                    )
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                roughnessMap
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value!.onSelect(
                        "normalMap"
                    )
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                normalMap
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value!.onSelect(
                        "envMap"
                    )
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                envMap
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value!.onSelect(
                        "aoMap"
                    )
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                aoMap
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserMaterialContextMenuSignal.value!.onSelect(
                        "alphaMap"
                    )
                    fileBrowserMaterialContextMenuSignal.value = undefined
                }}
            >
                alphaMap
            </MenuButton>
        </ContextMenu>
    )
}

export default FileBrowserMaterialContextMenu
