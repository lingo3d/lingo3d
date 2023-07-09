import { Signal, signal } from "@preact/signals"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"
import openJSON from "../../api/files/openJSON"
import openFolder from "../../api/files/openFolder"
import saveJSON from "../../api/files/saveJSON"
import exportJSON from "../../api/files/exportJSON"
import { setScript } from "../../states/useScript"
import Script from "../../display/Script"
import { newScriptDialogSignal } from "../ScriptEditor/NewScriptDialog"
import createJSON from "../../api/files/createJSON"
import exportReact from "../../api/files/exportReact"
import exportVue from "../../api/files/exportVue"
import { PointType } from "../../typeGuards/isPoint"

export const menuBarFileContextMenuSignal: Signal<PointType | undefined> =
    signal(undefined)

const MenuBarFileContextMenu = () => {
    return (
        <ContextMenu positionSignal={menuBarFileContextMenuSignal}>
            <MenuButton onClick={createJSON}>New File</MenuButton>
            <MenuButton
                onClick={() => {
                    newScriptDialogSignal.value = {
                        onConfirm: (name, language, mode) => {
                            const script = new Script()
                            script.name = name
                            script.language = language
                            script.mode = mode
                            script.code = `import { createSystem } from "lingo3d"\n\n`
                            setScript(script)
                        }
                    }
                    menuBarFileContextMenuSignal.value = undefined
                }}
            >
                New Script
            </MenuButton>
            <MenuButton
                onClick={() => {
                    openJSON()
                    menuBarFileContextMenuSignal.value = undefined
                }}
            >
                Open
            </MenuButton>
            <MenuButton
                onClick={() => {
                    openFolder()
                    menuBarFileContextMenuSignal.value = undefined
                }}
            >
                Open Project
            </MenuButton>
            <MenuButton
                onClick={() => {
                    saveJSON()
                    menuBarFileContextMenuSignal.value = undefined
                }}
            >
                Save
            </MenuButton>
            <MenuButton
                onClick={() => {
                    exportJSON()
                    menuBarFileContextMenuSignal.value = undefined
                }}
            >
                Export JSON
            </MenuButton>
            <MenuButton
                onClick={() => {
                    exportReact()
                    menuBarFileContextMenuSignal.value = undefined
                }}
            >
                Export for React
            </MenuButton>
            <MenuButton
                onClick={() => {
                    exportVue()
                    menuBarFileContextMenuSignal.value = undefined
                }}
            >
                Export for Vue 3
            </MenuButton>
        </ContextMenu>
    )
}

export default MenuBarFileContextMenu
