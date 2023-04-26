import { upperFirst } from "@lincode/utils"
import Appendable from "../../api/core/Appendable"

export default (appendable: Appendable) =>
    appendable.name || upperFirst(appendable.componentName)
