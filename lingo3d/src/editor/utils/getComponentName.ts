import { upperFirst } from "@lincode/utils"
import Appendable from "../../api/core/Appendable"
import unsafeGetValue from "../../utils/unsafeGetValue"

export default (appendable: Appendable) =>
    unsafeGetValue(appendable, "name") ||
    upperFirst(unsafeGetValue(appendable.constructor, "componentName"))
