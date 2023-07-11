import { memo } from "preact/compat"
import { sceneGraphContextMenuSignal } from ".."
import { componentNameMenuButtonMap } from "../../../../collections/componentNameMenuButtonMap"
import MenuButton from "../../../component/MenuButton"
import { returnTrue } from "../../../../display/utils/reusables"

componentNameMenuButtonMap.set(
    "model",
    memo(() => {
        return (
            <MenuButton
                onClick={() =>
                    (sceneGraphContextMenuSignal.value = {
                        ...sceneGraphContextMenuSignal.value!,
                        search: true
                    })
                }
            >
                Search children
            </MenuButton>
        )
    }, returnTrue)
)
