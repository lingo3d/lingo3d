import { upperFirst } from "@lincode/utils"
import Appendable from "../../display/core/Appendable"

export default (appendable: Appendable) =>
    appendable.name || upperFirst(appendable.componentName)
