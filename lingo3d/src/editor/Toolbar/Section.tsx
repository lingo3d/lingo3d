import { ComponentChildren } from "preact"
import Separator from "./Separator"

type SectionOptions = {
    children?: ComponentChildren
}

const Section = ({ children }: SectionOptions) => {
    return (
        <>
            {children}
            <Separator />
        </>
    )
}
export default Section
