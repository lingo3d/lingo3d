import { ComponentChildren, Fragment, h } from "preact"
import { preventTreeShake } from "@lincode/utils"
import Separator from "./Separator"

preventTreeShake(h)

type SectionOptions = {
    children?: ComponentChildren
}

const Section = ({ children }: SectionOptions) => {
    if (!Array.isArray(children) || !children.length) return null

    return (
        <Fragment>
            {children}
            <Separator />
        </Fragment>
    )
}
export default Section
