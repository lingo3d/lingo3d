import unsafeGetValue from "../../utils/unsafeGetValue"

export default !!unsafeGetValue(window, "chrome")
