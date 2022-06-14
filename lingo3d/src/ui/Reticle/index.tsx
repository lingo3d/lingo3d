import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import Reticle0 from "./Reticle0"
import { Disposable } from "@lincode/promiselikes"

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


    }
}