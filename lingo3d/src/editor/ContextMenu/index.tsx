import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import register from "preact-custom-element"
import { useEffect } from "preact/hooks"
import { container } from "../../engine/renderLoop/renderSetup"

preventTreeShake(h)

const ContextMenu = () => {
    useEffect(() => {
    }, [])

    return (
        <div></div>
    )
}

register(ContextMenu, "lingo3d-contextmenu")