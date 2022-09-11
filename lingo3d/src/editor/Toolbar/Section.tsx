import { ComponentChildren, Fragment } from "preact"
import Separator from "./Separator"

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
