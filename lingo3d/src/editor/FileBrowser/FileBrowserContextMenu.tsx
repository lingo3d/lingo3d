import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"

export const fileBrowserContextMenuSignal: Signal<
    (Point & { create?: boolean }) | undefined
> = signal(undefined)

const FileBrowserContextMenu = () => {
    return (
        <ContextMenu
            positionSignal={fileBrowserContextMenuSignal}
            input={
                fileBrowserContextMenuSignal.value?.create && {
                    label: "File name",
                    onInput: (value) => {
                        console.log(value)
                    }
                }
            }
        >
            <MenuButton
                onClick={() =>
                    (fileBrowserContextMenuSignal.value = {
                        x: fileBrowserContextMenuSignal.value?.x ?? 0,
                        y: fileBrowserContextMenuSignal.value?.y ?? 0,
                        create: true
                    })
                }
            >
                New scene
            </MenuButton>
            <MenuButton
                onClick={() => {
                    fileBrowserContextMenuSignal.value = undefined
                }}
            >
                Existing files
            </MenuButton>
        </ContextMenu>
    )
}

export default FileBrowserContextMenu
