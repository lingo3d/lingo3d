import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import Reticle0 from "./Reticle0"
import { Disposable } from "@lincode/promiselikes"
import createElement from "../../utils/createElement"

preventTreeShake(h)

const Reticle = () => {
    return (
        <Reticle0 />
    )
}

register(Reticle, "lingo3d-reticle")

export default class extends Disposable {
    public constructor() {
        super()

        const reticle = createElement(`
            <lingo3d-reticle></lingo3d-reticle>
        `)
        console.log(reticle)
    }
}